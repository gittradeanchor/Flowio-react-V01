import React from 'react';

export const StickyMobileCTA = () => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-border p-3 px-5 shadow-[0_-4px_12px_rgba(0,0,0,0.12)] z-[100] flex flex-col gap-2">
            <a href="#test-drive" className="flex items-center justify-center w-full text-base py-3.5 font-bold text-white rounded-xl bg-gradient-to-br from-orange to-orange-hover shadow-none">
                Run a Live Demo (30s) <span className="ml-2 text-xl leading-[0] pb-0.5">▸</span>
            </a>
        </div>
    );
};