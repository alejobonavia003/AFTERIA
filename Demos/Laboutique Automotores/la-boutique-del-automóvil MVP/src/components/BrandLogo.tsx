import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtext = true
}) => {
  const isDark = variant === 'dark';
  
  const widthMap = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20'
  };

  const textColor = isDark ? 'text-zinc-900' : 'text-white';
  const subTextColor = isDark ? 'text-zinc-600' : 'text-zinc-300';
  const strokeColor = isDark ? '#09090b' : '#ffffff';

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`flex flex-col justify-center ${widthMap[size]}`}>
        {/* Car silhouette curve matching the official logo */}
        <svg
          viewBox="0 0 400 90"
          className="w-full h-auto max-h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 70 C 80 68, 110 40, 140 38 C 210 15, 290 10, 320 28 C 340 38, 360 62, 385 60 C 390 60, 375 75, 300 70 C 200 68, 140 70, 130 72 Z"
            fill={strokeColor}
          />
        </svg>

        {/* Text typography matching La Boutique del Automóvil style */}
        <div className="flex flex-col -mt-1">
          <span
            className={`font-black tracking-tight uppercase leading-none font-sans ${textColor}`}
            style={{
              fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.35rem' : '1.8rem',
              letterSpacing: '-0.02em',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            La Boutique
          </span>
          <span
            className={`font-black uppercase tracking-wider leading-none ${textColor}`}
            style={{
              fontSize: size === 'sm' ? '0.85rem' : size === 'md' ? '1.15rem' : '1.5rem',
              letterSpacing: '0.05em'
            }}
          >
            del <span className="font-extrabold">Automóvil</span>
          </span>
        </div>

        {showSubtext && (
          <div className={`text-[10px] font-semibold tracking-widest uppercase mt-0.5 ${subTextColor}`}>
            Cristian Bongiovanni — Taller Mecánico
          </div>
        )}
      </div>
    </div>
  );
};
