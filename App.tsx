import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { TestDrive } from './components/TestDrive';
import { LogicSection } from './components/LogicSection';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const App = () => {
    const [showWhatsApp, setShowWhatsApp] = useState(false);

    // Scroll listener for WhatsApp bubble
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowWhatsApp(true);
            } else {
                setShowWhatsApp(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scarcity Bar
    const ScarcityBar = () => (
        <div className="fixed top-0 left-0 w-full bg-[#FFF7ED] text-[#9A3412] text-center py-2 text-[13px] font-bold z-50 border-b border-[#FED7AA] flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-orange rounded-full pulsing-dot"></span>
            <span>Only 2 installs available this week</span>
        </div>
    );

    // WhatsApp Float (Hidden on Hero)
    const WhatsAppFloat = () => (
        <a 
            href="https://wa.me/61494186989" 
            target="_blank" 
            rel="noreferrer"
            className={`fixed bottom-5 right-5 md:bottom-10 md:right-10 w-[60px] h-[60px] bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-50 duration-300 ${showWhatsApp ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
            aria-label="Chat on WhatsApp"
        >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.2C16.32 14.08 15.11 13.48 14.89 13.4C14.66 13.32 14.5 13.28 14.33 13.53C14.17 13.78 13.7 14.33 13.56 14.5C13.42 14.66 13.28 14.68 13.03 14.56C12.78 14.44 11.99 14.18 11.05 13.34C10.33 12.7 9.84 11.91 9.7 11.66C9.56 11.41 9.69 11.28 9.81 11.16C9.92 11.05 10.06 10.88 10.19 10.73C10.32 10.58 10.36 10.47 10.44 10.3C10.52 10.14 10.48 9.99 10.42 9.87C10.36 9.75 9.9 8.63 9.71 8.17C9.52 7.73 9.33 7.79 9.19 7.79C9.06 7.79 8.91 7.78 8.76 7.78C8.61 7.78 8.36 7.84 8.15 8.07C7.94 8.3 7.34 8.86 7.34 10C7.34 11.14 8.17 12.24 8.29 12.41C8.41 12.58 9.94 14.94 12.34 15.98C14.67 16.99 15.14 16.79 15.56 16.75C16.36 16.68 17.18 16.23 17.5 15.34C17.82 14.45 17.82 13.69 17.76 13.59C17.7 13.49 17.55 13.43 17.3 13.31H16.57V14.2Z"/>
            </svg>
        </a>
    );

    return (
        <div className="pb-10 md:pb-0 font-sans text-base text-navy">
            <ScarcityBar />
            <Header />
            
            <main>
                <Hero />
                <Benefits />
                <TestDrive />
                <LogicSection />
                <Pricing />
                <FAQ />
            </main>

            <Footer />
            <WhatsAppFloat />
        </div>
    );
};

export default App;