import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated social proof counter bar.
 * Shows "X quotes sent via Flowio" with a count-up animation.
 *
 * To connect to real data later:
 * 1. Create an API endpoint in your CRM Apps Script that returns total quotes
 * 2. Set VITE_QUOTES_API_URL in .env
 * 3. The component will fetch the real count on load
 */
export const SocialProofBar = () => {
    const apiUrl = import.meta.env.VITE_QUOTES_API_URL;
    const [count, setCount] = useState(0);
    const [targetCount, setTargetCount] = useState(247); // Starting baseline
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Fetch real count if API is available
    useEffect(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(r => r.json())
                .then(data => {
                    if (data.totalQuotes && data.totalQuotes > 0) {
                        setTargetCount(data.totalQuotes);
                    }
                })
                .catch(() => {}); // silently fall back to default
        }
    }, [apiUrl]);

    // Intersection observer for triggering animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Count-up animation
    useEffect(() => {
        if (!isVisible) return;
        const duration = 1500;
        const steps = 40;
        const increment = targetCount / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
                setCount(targetCount);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [isVisible, targetCount]);

    return (
        <div ref={ref} className="bg-white border-b border-border/50">
            <div className="container mx-auto px-5 py-4 flex justify-center items-center gap-6 md:gap-10 flex-wrap">
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl">&#9889;</span>
                    <div>
                        <span className="text-xl md:text-2xl font-black text-navy">{count.toLocaleString()}</span>
                        <span className="text-sm text-text-muted font-medium ml-1.5">quotes sent via Flowio</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2.5 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span className="font-medium">No monthly fees</span>
                </div>
                <div className="hidden md:flex items-center gap-2.5 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span className="font-medium">DFY setup in 48h</span>
                </div>
                <div className="hidden lg:flex items-center gap-2.5 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span className="font-medium">Full refund guarantee</span>
                </div>
            </div>
        </div>
    );
};
