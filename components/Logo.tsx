import React from 'react';

/**
 * TradeAnchor logo (21 Sept 2026).
 * Mark: an anchor on an ink nameplate with a copper base bar. It reads as a trade sign or a stamp on a quote,
 * and it is not tied to one trade, so the brand can widen later without a redraw.
 * Colours come from the brand tokens: ink #1C1917, paper #F6F1E9, copper #B4501A.
 */
export const LogoMark = ({ size = 40, tone = 'ink', title }: { size?: number; tone?: 'ink' | 'copper'; title?: string }) => {
    const plate = tone === 'ink' ? '#1C1917' : '#B4501A';
    const anchor = tone === 'ink' ? '#F6F1E9' : '#1C1917';
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
            <rect width="48" height="48" fill={plate} />
            <g fill="none" stroke={anchor} strokeWidth="4">
                <circle cx="24" cy="9.5" r="4.2" />
                <path d="M24 13.7V38M16.5 20H31.5" />
                <path d="M9.5 26C9.5 35 16 40.5 24 40.5S38.5 35 38.5 26" />
            </g>
            <path fill={anchor} d="M9.5 21.5L3.6 29.5H15.4ZM38.5 21.5L32.6 29.5H44.4Z" />
            {tone === 'ink' && <rect y="43" width="48" height="5" fill="#B4501A" />}
        </svg>
    );
};

export const Logo = ({ size = 36, onDark = false, className = '' }: { size?: number; onDark?: boolean; className?: string }) => (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <LogoMark size={size} tone={onDark ? 'copper' : 'ink'} />
        <span className={`font-display font-extrabold tracking-tight leading-none ${onDark ? 'text-bg-off' : 'text-navy'}`} style={{ fontSize: size * 0.62 }}>
            Trade<span className={onDark ? 'text-[#D9773A]' : 'text-orange'}>Anchor</span>
        </span>
    </span>
);
