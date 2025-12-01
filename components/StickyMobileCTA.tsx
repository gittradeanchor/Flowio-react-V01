import React from 'react';

export const StickyMobileCTA = () => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border p-3 px-5 shadow-[0_-4px_12px_rgba(0,0,0,0.12)] z-[100] flex flex-col gap-2">
            <a href="#test-drive" className="btn btn-primary w-full justify-center text-base py-3.5 rounded-xl shadow-none">
                Test Drive It (30s)
            </a>
        </div>
    );
};