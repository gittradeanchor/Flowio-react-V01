import React from 'react';

const Tick = () => (
    <svg className="w-4 h-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
);

/**
 * Trust strip. Only claims backed by 02_OFFER "Allowed claims" and the pilot terms.
 * No counters, no testimonials — add real ones when a pilot gives them.
 */
export const SocialProofBar = () => {
    return (
        <div className="bg-white border-b border-border/50">
            <div className="container mx-auto px-5 py-4 flex justify-center items-center gap-6 md:gap-10 flex-wrap">
                <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-orange inline-block" aria-hidden="true"></span>
                    <span className="text-sm text-text-muted font-medium">Built for Australian electricians</span>
                </div>
                <div className="hidden md:flex items-center gap-2.5 text-sm text-text-muted">
                    <Tick />
                    <span className="font-medium">No app to install</span>
                </div>
                <div className="hidden md:flex items-center gap-2.5 text-sm text-text-muted">
                    <Tick />
                    <span className="font-medium">Done-for-you setup</span>
                </div>
                <div className="hidden lg:flex items-center gap-2.5 text-sm text-text-muted">
                    <Tick />
                    <span className="font-medium">30-day money-back guarantee</span>
                </div>
            </div>
        </div>
    );
};
