import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const siteId = String(body.siteId || '');
    const name = String(body.name || '');
    const email = String(body.email || '');
    const message = String(body.message || '');

    if (!siteId || !name || !email) {
      return NextResponse.json(
        { error: 'Name, email and siteId are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from('leads').insert({
      site_id: siteId,
      data: {
        name,
        email,
        message,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}