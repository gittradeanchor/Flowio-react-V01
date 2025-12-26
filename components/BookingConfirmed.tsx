import React, { useEffect, useState } from 'react';
import { getStoredAttribution } from '../hooks/useAttribution';

export const BookingConfirmed = () => {
    const [fired, setFired] = useState(false);

useEffect(() => {
  // 0) Read Calendly params FIRST (before stripping)
  const params = new URLSearchParams(window.location.search);

  const booking = {
    src: params.get('src') || '',
    invitee_email: params.get('invitee_email') || '',
    text_reminder_number: params.get('text_reminder_number') || '',
    invitee_uuid: params.get('invitee_uuid') || '',
    event_start_time: params.get('event_start_time') || '',
    event_end_time: params.get('event_end_time') || '',
    event_type_uuid: params.get('event_type_uuid') || '',
    page_url: window.location.href,
  };

  // 1) Strip Calendly junk + PII from URL (after capture)
  if (booking.src === 'calendly') {
    window.history.replaceState({}, '', '/booking-confirmed?src=calendly');
  }

  // 2) SEO: noindex
  const metaRobots = document.createElement('meta');
  metaRobots.name = 'robots';
  metaRobots.content = 'noindex, nofollow';
  document.head.appendChild(metaRobots);

  // 3) Tracking: once per session
  const hasFired = sessionStorage.getItem('flowio_booking_tracked');
  const attrib = getStoredAttribution();

  if (!hasFired) {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Schedule', {
        value: 0,
        currency: 'AUD',
        ...attrib,
      });
    }

    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL || '';
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'booking_confirmed',
          timestamp: new Date().toISOString(),
          booking,
          ...attrib,
        }),
      }).catch(err => console.error('Tracking error:', err));
    } else {
      console.warn('Missing VITE_MAKE_WEBHOOK_URL');
    }

    sessionStorage.setItem('flowio_booking_tracked', 'true');
    setFired(true);
  }

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
