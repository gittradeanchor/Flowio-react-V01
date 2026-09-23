
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

export const Header = ({ isHidden = false, isSecondaryCta = false }: { isHidden?: boolean, isSecondaryCta?: boolean }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Always visible on mobile (hamburger accessible from page load)
    // On desktop: only visible after scroll (slide-in nav behaviour unchanged)
    const isVisible = !isHidden && (isScrolled || isMobile);

    const navItems = [
        { label: 'Test Drive', href: '#test-drive' },
        { label: 'Pricing', href: '#offer' },
        // No target="_blank": a wa.me link needs a same-tab navigation to hand off to the WhatsApp app (see ChatWidget.tsx).
        { label: 'Get in Touch', href: import.meta.env.VITE_WHATSAPP_LINK },
    ];

    return (
        <>
            <header 
                className={`fixed top-0 w-full bg-white/98 backdrop-blur-sm border-b border-border z-40 py-1.5 transition-transform duration-300 ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="container mx-auto px-5 flex justify-between items-center max-w-[1100px]">
                    <a href="#" className="flex items-center min-h-[44px] no-underline" aria-label="TradeAnchor home"><Logo size={34} /></a>

                    {/* Desktop: plain text links for wayfinding (not more buttons — the hero and pricing already carry
                        the one primary action), then the one secondary CTA. A hamburger belongs on mobile, not desktop:
                        these are cheaper to scan and don't need a click to reveal (fixes 22 Sept: desktop had no
                        hamburger AND no links, so Test Drive/Pricing/WhatsApp were unreachable from the header). */}
                    <div className="hidden md:flex items-center gap-8">
                        <nav className="flex items-center gap-6 text-[15px] font-semibold text-navy">
                            <a href="#test-drive" className="min-h-[44px] flex items-center hover:text-orange transition-colors">Test Drive</a>
                            <a href="#offer" className="min-h-[44px] flex items-center hover:text-orange transition-colors">Pricing</a>
                            <a href={import.meta.env.VITE_WHATSAPP_LINK} className="min-h-[44px] flex items-center hover:text-orange transition-colors">Get in Touch</a>
                        </nav>
                        <a
                            href={import.meta.env.VITE_CALENDLY_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 px-10 py-2.5 text-[15px] font-bold rounded-xl active:translate-y-0.5 transition-all bg-white text-navy border-2 border-navy hover:bg-bg-off shadow-sm"
                        >
                            Book a Fit Call
                        </a>
                    </div>

                    {/* Mobile Right Side Group */}
                    <div className="flex items-center gap-3 md:hidden">
                        
                        <button 
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-navy focus:outline-none"
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
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-bold text-navy py-2 border-b border-border/50"
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
