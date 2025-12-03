import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { TechStack } from './components/TechStack';
import { Benefits } from './components/Benefits';
import { TestDrive } from './components/TestDrive';
import { LogicSection } from './components/LogicSection';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ChatWidget } from './components/ChatWidget';

const App = () => {
    // isFocusMode now only applies to the Pricing section
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleSections(prev => {
                    const newSet = new Set(prev);
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            newSet.add(entry.target.id);
                        } else {
                            newSet.delete(entry.target.id);
                        }
                    });
                    return newSet;
                });
            },
            { threshold: 0.15 } // Trigger when 15% of the section is visible
        );

        const pricingTarget = document.getElementById('offer');
        // Removed testDriveTarget from observer as requested

        if (pricingTarget) observer.observe(pricingTarget);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setIsFocusMode(visibleSections.has('offer'));
    }, [visibleSections]);

    // Scarcity Bar
    const ScarcityBar = () => (
        <div className={`fixed top-0 left-0 w-full bg-[#FFF7ED] text-[#9A3412] text-center py-2 text-[13px] font-bold z-50 border-b border-[#FED7AA] flex justify-center items-center gap-2 px-2 leading-tight transition-transform duration-300 ${isFocusMode ? '-translate-y-full' : 'translate-y-0'}`}>
            <span className="w-2 h-2 bg-orange rounded-full pulsing-dot shrink-0"></span>
            <span>Only 2 installs left this week (DFY setup + testing).</span>
        </div>
    );

    return (
        <div className="pb-10 md:pb-0 font-sans text-base text-navy">
            <ScarcityBar />
            <Header isHidden={isFocusMode} />
            
            <main>
                <Hero />
                <TechStack />
                <Benefits />
                <TestDrive />
                <LogicSection />
                <Pricing />
                <FAQ />
            </main>

            <Footer />
            <ChatWidget isHidden={isFocusMode} />
        </div>
    );
};

export default App;
