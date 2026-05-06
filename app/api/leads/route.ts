import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Базовые проверки
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Разрешённые домены (добавьте свои)
    const allowedOrigins = [
      'http://localhost:3000',
      'https://corshun.ru',
      'https://www.corshun.ru',
    ];
    
    // Проверяем origin или referer
    const isValidOrigin = origin 
      ? allowedOrigins.some(allowed => allowed === origin || origin.startsWith(allowed))
      : referer 
        ? allowedOrigins.some(allowed => referer.startsWith(allowed))
        : false;
    
    if (!isValidOrigin && process.env.NODE_ENV === 'production') {
      console.warn(`Lead API: Заблокирован запрос с origin=${origin}, referer=${referer}`);
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    // 2. Парсинг тела запроса
    const body = await request.json();
    
    // Поддержка разных форматов (старый и новый)
    let siteId: string | null = null;
    let name = '';
    let phone = '';
    let email = '';
    let message = '';
    
    if (body.siteId) {
      siteId = String(body.siteId);
      name = String(body.name || '');
      email = String(body.email || '');
      message = String(body.message || '');
    } else if (body.data) {
      // Старый формат: { siteId, data: { name, phone, email, message } }
      siteId = String(body.siteId);
      name = String(body.data.name || '');
      phone = String(body.data.phone || '');
      email = String(body.data.email || '');
      message = String(body.data.message || '');
    } else {
      // Прямые поля
      siteId = String(body.siteId || body.site_id || '');
      name = String(body.name || '');
      phone = String(body.phone || '');
      email = String(body.email || '');
      message = String(body.message || '');
    }
    
    // 3. Валидация
    if (!siteId) {
      return NextResponse.json(
        { error: 'Отсутствует ID сайта (siteId)' }, 
        { status: 400 }
      );
    }
    
    if (!name && !phone && !email) {
      return NextResponse.json(
        { error: 'Укажите хотя бы одно контактное поле (имя, телефон или email)' }, 
        { status: 400 }
      );
    }

    // 4. Сохранение в Supabase
    const supabase = await createClient();
    
    const leadData: Record<string, unknown> = {
      site_id: siteId,
      data: {
        name: name || null,
        phone: phone || null,
        email: email || null,
        message: message || null,
        user_agent: request.headers.get('user-agent') || null,
        ip_hash: await hashIp(request.headers.get('x-forwarded-for') || 'unknown'),
      },
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('leads')
      .insert(leadData);

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json(
        { error: 'Не удалось сохранить заявку' }, 
        { status: 500 }
      );
    }

    // 5. Опционально: отправка уведомления в Telegram/Slack
    // await sendNotification({ name, phone, email, siteId });

    return NextResponse.json({ 
      success: true, 
      message: 'Заявка успешно отправлена' 
    }, { status: 201 });

  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' }, 
      { status: 500 }
    );
  }
}

// Вспомогательная функция для хеширования IP (GDPR-friendly)
async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.IP_SALT || 'default-salt'));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}