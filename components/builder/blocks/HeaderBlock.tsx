'use client';

import React from 'react';
import Link from 'next/link';
import InlineText from '../InlineText';
import { BlockStyleSettings } from './BlockRenderer';

type NavItem = string | { label?: string; text?: string; title?: string; href?: string };

interface HeaderBlockProps {
  blockId: string;
  editable?: boolean;
  logo?: string;
  links?: NavItem[];
  buttonText?: string;
  blockStyle?: BlockStyleSettings;
}

export default function HeaderBlock({ 
  blockId, 
  editable = false, 
  logo = "Corshun", 
  links = [], 
  buttonText = "Начать",
  blockStyle 
}: HeaderBlockProps) {
  
  const getLinkText = (item: NavItem): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      return item.label || item.text || item.title || "Ссылка";
    }
    return "Ссылка";
  };

  const getLinkHref = (item: NavItem): string => {
    if (typeof item === 'string') return '#';
    if (item && typeof item === 'object') {
      return item.href || '#';
    }
    return '#';
  };

  const variant = blockStyle?.variant || 'left';
  const backgroundColor = blockStyle?.backgroundColor || '#050505';
  const textColor = blockStyle?.textColor || '#ffffff';
  const paddingY = blockStyle?.paddingY ?? 18;
  const paddingX = blockStyle?.paddingX ?? 32;
  const containerWidth = blockStyle?.containerWidth ?? 1240;
  const radius = blockStyle?.radius ?? 999;

  const Logo = () => (
    <InlineText
      blockId={blockId}
      propKey="logo"
      value={logo}
      editable={editable}
      as="div"
      className="text-xl font-bold tracking-wider"
    />
  );

  const NavLinks = () => (
    <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
      {links.map((item, index) => (
        <li key={index}>
          <Link 
            href={getLinkHref(item)}
            className="hover:opacity-70 transition-opacity"
          >
            {getLinkText(item)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const CTAButton = () => (
    <InlineText
      blockId={blockId}
      propKey="buttonText"
      value={buttonText}
      editable={editable}
      as="button"
      className="px-5 py-2.5 text-sm font-black transition hover:scale-[1.02]"
      style={{
        borderRadius: radius,
        backgroundColor: blockStyle?.buttonBackgroundColor || '#ffffff',
        color: blockStyle?.buttonTextColor || '#000000',
      }}
    />
  );

  const containerStyle = {
    maxWidth: containerWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  if (variant === 'centered') {
    return (
      <header style={{ backgroundColor, color: textColor, paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX }}>
        <div style={containerStyle} className="flex items-center justify-between">
          <Logo />
          <NavLinks />
          <CTAButton />
        </div>
      </header>
    );
  }

  if (variant === 'glass') {
    return (
      <header style={{ paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX }}>
        <div style={containerStyle} className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 flex items-center justify-between">
          <Logo />
          <NavLinks />
          <CTAButton />
        </div>
      </header>
    );
  }

  if (variant === 'logo-center') {
    return (
      <header style={{ backgroundColor, color: textColor, paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX }}>
        <div style={containerStyle} className="text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
          <NavLinks />
        </div>
      </header>
    );
  }

  return (
    <header style={{ backgroundColor, color: textColor, paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX }}>
      <div style={containerStyle} className="flex items-center justify-between gap-8">
        <Logo />
        <NavLinks />
        <CTAButton />
      </div>
    </header>
  );
}