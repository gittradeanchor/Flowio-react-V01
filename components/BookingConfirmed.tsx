import React, { useEffect, useState } from 'react';
import { getStoredAttribution } from '../hooks/useAttribution';

export const BookingConfirmed = () => {
    const [fired, setFired] = useState(false);

    useEffect(() => {
        // Strip Calendly junk + PII from URL (keep only src=calendly)
        const url = new URL(window.location.href);
        if (url.searchParams.get('src') === 'calendly') {
          window.history.replaceState({}, '', '/booking-confirmed?src=calendly');
        }

        // 1. SEO: Add noindex, nofollow dynamically
        const metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        metaRobots.content = 'noindex, nofollow';
        document.head.appendChild(metaRobots);

        // 2. TRACKING: Fire Meta Pixel (Schedule) - Once per session
        const hasFired = sessionStorage.getItem('flowio_booking_tracked');
        const attrib = getStoredAttribution();
        
        if (!hasFired) {
            // A) Browser Pixel
            if ((window as any).fbq) {
                (window as any).fbq('track', 'Schedule', {
                    value: 0,
                    currency: 'AUD',
                    ...attrib // Pass attribution data if pixel allows custom parameters
                });
                console.log('pixel_fired: Schedule');
            } else {
                console.log('pixel_missing: Schedule event simulated');
            }

            // B) Server-side Tracking (Optional) - using existing webhook or placeholder
            // Using a generic webhook structure as requested
            const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || '';
            
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'booking_confirmed',
                    timestamp: new Date().toISOString(),
                    ...attrib
                }),
            }).catch(err => console.error("Tracking error:", err));

            sessionStorage.setItem('flowio_booking_tracked', 'true');
            setFired(true);
        } else {
            console.log('pixel_skipped: already fired this session');
        }

        // Cleanup meta tag on unmount (optional, but good practice)
        return () => {
            document.head.removeChild(metaRobots);
        };
    }, []);

    return (
        <div className="min-h-screen bg-bg-off flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in-up">
                
                {/* Header Section */}
                <div className="bg-navy p-8 text-center">
                    <div className="w-16 h-16 bg-green text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                        ✓
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Booked. You’re in.</h1>
                    <p className="text-white/80 text-lg font-medium">10-min phone fit check (no video).</p>
                </div>

                {/* Content Section */}
                <div className="p-8">
                    
                    {/* Next Steps List */}
                    <div className="space-y-4 mb-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">1</div>
                            <p className="text-navy font-medium text-base">We’ll call you at your booked time.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">2</div>
                            <div className="text-navy font-medium text-base">
                                <p className="mb-1">Have this info ready:</p>
                                <ul className="list-disc pl-4 text-sm text-text-muted space-y-1">
                                    <li>Roughly how many quotes / month?</li>
                                    <li>How do you send them now?</li>
                                    <li>Do you take deposits?</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation CTA */}
                    <div className="bg-orange/5 border-2 border-orange/20 rounded-xl p-5 text-center mb-6">
                        <p className="font-bold text-navy mb-3 text-lg">Reply "Y" to confirm your slot.</p>
                        <a 
                            href="sms:?body=Y" 
                            className="block w-full bg-navy text-white font-bold py-3.5 rounded-lg shadow-btn-navy hover:bg-navy-light transition-all active:translate-y-0.5"
                        >
                            Text "Y" Now
                        </a>
                        <p className="text-xs text-text-muted mt-2">
                            (Or just reply to the text we send you shortly)
                        </p>
                    </div>

                    {/* Footer Scarcity */}
                    <div className="text-center pt-4 border-t border-border">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            Reminder: Only 3 installs / week
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
