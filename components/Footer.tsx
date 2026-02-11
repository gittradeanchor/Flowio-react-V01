import React from 'react';

export const Footer = () => {
    return (
        <footer id="footer" className="py-10 bg-navy-light text-white/60 text-center text-sm">
            <div className="container mx-auto px-5">
                <p>&copy; 2026 TradeAnchor. Installing Flowio™ for Australian Tradies.</p>
                <div className="mt-4 flex justify-center gap-6">
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
                </div>
            </div>
        </footer>
    );
};