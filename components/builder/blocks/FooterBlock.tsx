// components/builder/blocks/FooterBlock.tsx
import React from 'react';

interface FooterBlockProps {
  blockId: string;
  editable?: boolean;
  brand?: string;
  description?: string;
  columns?: string[];
  links?: string[];
  copyright?: string;
  blockStyle?: any;
}

export default function FooterBlock({
  blockId,
  editable,
  brand,
  description,
  columns = [],
  links = [],
  copyright,
  blockStyle
}: FooterBlockProps) {
  return (
    <footer 
      className="w-full py-16 px-6 border-t border-gray-200/50 bg-white text-gray-800" 
      style={blockStyle}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-bold tracking-tight mb-4 text-black">
            {brand || 'Brand Name'}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed pr-4">
            {description || 'Инновационные решения для вашего бизнеса. Создаем премиальный цифровой опыт.'}
          </p>
        </div>

        {columns && columns.length > 0 ? (
          columns.map((col, index) => (
            <div key={index} className="flex flex-col space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{col}</h4>
              <div className="flex flex-col space-y-3 text-sm text-gray-500">
                <a href="#" className="hover:text-black transition-colors">Ссылка 1</a>
                <a href="#" className="hover:text-black transition-colors">Ссылка 2</a>
                <a href="#" className="hover:text-black transition-colors">Ссылка 3</a>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Продукт</h4>
              <div className="flex flex-col space-y-3 text-sm text-gray-500">
                <a href="#" className="hover:text-black transition-colors">Возможности</a>
                <a href="#" className="hover:text-black transition-colors">Тарифы FLIGHT</a>
                <a href="#" className="hover:text-black transition-colors">Интеграции</a>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>
          {copyright || `© ${new Date().getFullYear()} ${brand || 'Your Company'}. Все права защищены.`}
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          {links && links.map((link, i) => (
            <a key={i} href="#" className="hover:text-gray-900 transition-colors">{link}</a>
          ))}
          {(!links || links.length === 0) && (
            <>
              <a href="#" className="hover:text-gray-900 transition-colors">Конфиденциальность</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Условия</a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}