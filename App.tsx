import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import Preinstall from './components/Preinstall';
import { TechStack } from './components/TechStack';
import { Benefits } from './components/Benefits';
import { TestDrive } from './components/TestDrive';
import { LogicSection } from './components/LogicSection';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ChatWidget } from './components/ChatWidget';
import { BookingConfirmed } from './components/BookingConfirmed';
import { QuotingAudit } from './components/QuotingAudit';
import { SocialProofBar } from './components/SocialProofBar';
import { useAttribution } from './hooks/useAttribution';

const App = () => {
    // Basic Routing Logic
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    
    // 1. Capture Attribution (UTMs, Click IDs)
    useAttribution();
    useEffect(() => {
        const handlePopState = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // RENDER: BOOKING CONFIRMED PAGE
    const path = (currentPath || "").replace(/\/+$/, "") || "/";
    
    if (path === "/booking-confirmed") return <BookingConfirmed />;
    if (path === "/onboarding/preinstall") return <Preinstall />;


    // RENDER: MAIN LANDING PAGE
    return <LandingPage />;
};

// Extracted Main Landing Page Component for clarity
const LandingPage = () => {
    // isFocusMode hides Header/Nav (for Pricing)
    const [isFocusMode, setIsFocusMode] = useState(false);
    // isTestDriveActive tracks visibility of Test Drive section
    const [isTestDriveActive, setIsTestDriveActive] = useState(false);
    
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
        const testDriveTarget = document.getElementById('test-drive');

        if (pricingTarget) observer.observe(pricingTarget);
        if (testDriveTarget) observer.observe(testDriveTarget);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setIsFocusMode(visibleSections.has('offer'));
        setIsTestDriveActive(visibleSections.has('test-drive'));
    }, [visibleSections]);


    return (
        <div className="pb-10 md:pb-0 font-sans text-base text-navy">
            
            {/* Header: Hidden on Pricing AND Test Drive (Demo) */}
            <Header isHidden={isFocusMode || isTestDriveActive} isSecondaryCta={isTestDriveActive} />
            
            <main>
                <Hero />
                <SocialProofBar />
                <TechStack />
                <Benefits />
                <TestDrive />
                <LogicSection />
                <QuotingAudit />
                <Pricing />
                <FAQ />
            </main>

            <Footer />
            
            {/* Chat: Hidden on Pricing AND TestDrive */}
            <ChatWidget isHidden={isFocusMode || isTestDriveActive} />
        </div>
    );
};

export default App;
