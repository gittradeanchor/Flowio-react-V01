
import React, { useState } from 'react';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Test Drive', href: '#test-drive' },
        { label: 'Pricing', href: '#offer' },
        { label: 'Get in Touch', href: 'https://wa.me/61494186989', target: '_blank' },
        { label: 'Terms', href: '#footer' },
    ];

    return (
        <>
            <header className="fixed top-9 md:top-10 w-full bg-white/98 backdrop-blur-sm border-b border-border z-40 py-2 transition-all">
                <div className="container mx-auto px-5 flex justify-between items-center max-w-[1100px]">
                    <a href="#" className="flex items-center gap-2.5 no-underline">
                       <div className="text-2xl font-black text-navy tracking-tighter leading-none">
                            Trade<span className="text-orange">Anchor</span>
                       </div>
                    </a>

                    {/* Desktop CTA */}
                    <a 
                        href="#funnel-cta" 
                        className="hidden md:inline-flex items-center justify-center gap-2.5 px-10 py-2.5 text-[15px] font-bold bg-navy text-white rounded-xl shadow-btn-navy active:shadow-none active:translate-y-0.5 transition-all"
                    >
                        Book a Demo
                    </a>

                    {/* Mobile Right Side Group */}
                    <div className="flex items-center gap-3 md:hidden">
                        <a 
                            href="#funnel-cta"
                            className="px-4 py-2 text-xs font-bold bg-navy text-white rounded-lg shadow-sm whitespace-nowrap"
                        >
                            Book Demo
                        </a>
                        <button 
                            className="p-1 text-navy focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-30 bg-white pt-28 px-5 md:hidden animate-fade-in">
                    <nav className="flex flex-col gap-6 text-center">
                        {navItems.map((item) => (
                            <a 
                                key={item.label}
                                href={item.href}
                                target={item.target}
                                className="text-xl font-bold text-navy py-2 border-b border-border/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
};
