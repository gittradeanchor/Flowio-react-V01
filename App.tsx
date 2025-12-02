
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { TestDrive } from './components/TestDrive';
import { LogicSection } from './components/LogicSection';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ChatWidget } from './components/ChatWidget';

const App = () => {
    // Scarcity Bar
    const ScarcityBar = () => (
        <div className="fixed top-0 left-0 w-full bg-[#FFF7ED] text-[#9A3412] text-center py-2 text-[13px] font-bold z-50 border-b border-[#FED7AA] flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-orange rounded-full pulsing-dot"></span>
            <span>Only 2 installs available this week</span>
        </div>
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
            <ChatWidget />
        </div>
    );
};

export default App;
