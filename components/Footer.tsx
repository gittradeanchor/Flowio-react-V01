import React from 'react';
import { LEGAL_READY } from './Legal';

// Identity per D03: customer-facing party is "TradeAnchor, ABN ..." (no legal name printed).
// Terms / Privacy links are omitted until the real pages exist (checklist 1.1) — dead "#" links were a trust killer.
export const Footer = () => {
    return (
        <footer id="footer" className="py-10 bg-navy-light text-white/60 text-center text-sm">
            <div className="container mx-auto px-5">
                <p>&copy; 2026 TradeAnchor &middot; ABN 45 529 331 663 &middot; Sydney, NSW</p>
                <p className="mt-1">Flowio&trade; quoting for Australian electricians</p>
                <div className="mt-2 flex justify-center gap-x-6 flex-wrap">
                    <a href="mailto:hello@tradeanchor.com.au" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">hello@tradeanchor.com.au</a>
                    {LEGAL_READY && <a href="/terms" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Terms</a>}
                    {LEGAL_READY && <a href="/privacy" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Privacy</a>}
                    {LEGAL_READY ? <a href="/refund" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Refund policy</a> : <a href="#refund" className="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Refund policy</a>}
                </div>
            </div>
        </footer>
    );
};
