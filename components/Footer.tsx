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
                <div className="mt-4 flex justify-center gap-6">
                    <a href="mailto:hello@tradeanchor.com.au" className="hover:text-white transition-colors">hello@tradeanchor.com.au</a>
                    {LEGAL_READY && <a href="/terms" className="hover:text-white transition-colors">Terms</a>}
                    {LEGAL_READY && <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>}
                    {LEGAL_READY ? <a href="/refund" className="hover:text-white transition-colors">Refund policy</a> : <a href="#refund" className="hover:text-white transition-colors">Refund policy</a>}
                </div>
            </div>
        </footer>
    );
};
