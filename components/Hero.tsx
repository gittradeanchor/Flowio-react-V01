
import React, { useState } from 'react';


export const Hero = () => {
    const videoId = import.meta.env.VITE_YOUTUBE_ID;
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    if (!videoId) return null; // or render a fallback block
    return (
        <section className="pt-14 pb-5 md:pt-24 md:pb-12 bg-gradient-to-b from-bg-off to-white">
            {/* Hero-only top bar with logo — visible when header is hidden (before scroll) */}
            <div className="container mx-auto px-5 max-w-[1100px] mb-6 md:mb-10">
                <div className="flex items-center justify-between">
                    <img src="/tradeanchor-logo.png" alt="TradeAnchor" className="h-7 md:h-9" />
                    <a
                        href={import.meta.env.VITE_CALENDLY_URL || '#offer'}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-[13px] font-bold text-navy border-2 border-navy/15 rounded-lg hover:border-navy/30 transition-colors"
                    >
                        Book a Fit Call <span className="text-[10px]">→</span>
                    </a>
                </div>
            </div>

            <div className="container mx-auto px-5 max-w-[1100px] flex flex-col items-center md:grid md:grid-cols-[1fr_1.2fr] gap-4 md:gap-12 md:items-center">

                {/*
                  MOBILE LAYOUT ORDER:
                  1. Eyebrow + Headline + Sub
                  2. Video
                  3. CTA + Badge + Trust
                */}
                <div className="contents md:block order-1 md:order-none w-full">

                    {/* Eyebrow tag */}
                    <div className="flex items-center gap-2 mb-3 md:mb-4 order-1 w-full justify-center md:justify-start">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange/8 border border-orange/20 rounded-full text-[11px] md:text-[12px] uppercase tracking-[0.12em] font-bold text-orange">
                            <span className="w-1.5 h-1.5 bg-orange rounded-full"></span>
                            For Australian Tradies
                        </span>
                    </div>

                    <h1 className="text-[32px] md:text-[54px] leading-[1.08] font-black text-navy text-center md:text-left mb-3 md:mb-5 order-1 w-full mt-0">
                        Stop doing<br className="block md:hidden"/> paperwork at<br className="block md:hidden"/> <span className="whitespace-nowrap">9:00 PM.</span>
                    </h1>

                    {/* Subheadline Section */}
                    <div className="text-center md:text-left mb-5 md:mb-8 max-w-[540px] order-2 w-full">
                        <p className="text-[16px] md:text-[20px] font-semibold text-navy/80 mb-1.5 md:mb-2 leading-snug">
                            Send quote ▸ client accepts ▸ job booked.
                        </p>
                        <p className="text-[13px] md:text-[15px] text-text-muted font-medium leading-relaxed">
                            One-time setup · Runs inside your Google Sheets · You own everything
                        </p>
                    </div>

                    {/* CTA + Price row */}
                    <div className="flex flex-col items-center md:items-start w-full md:w-auto order-4 md:order-none mt-1 md:mt-0">

                        {/* CTA Button */}
                        <a href="#test-drive" className="flex items-center justify-center btn w-full md:w-auto md:min-w-[360px] px-8 py-4 min-h-[58px] text-lg font-bold text-white rounded-xl shadow-btn-primary hover:shadow-lg active:translate-y-0.5 transition-all relative overflow-hidden shine-effect bg-gradient-to-br from-orange to-orange-hover mb-3 md:mb-4">
                            Run a Live Demo (30s) <span className="ml-3 text-4xl leading-[0] pb-2">▸</span>
                        </a>

                        {/* Starting from $497 badge — sleek pill style */}
                        <div className="flex items-center gap-2.5 mb-3 md:mb-4 mx-auto md:mx-0">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-[#1a2744] pl-2.5 pr-4 py-[7px] rounded-full shadow-lg">
                                <span className="flex items-center justify-center w-6 h-6 bg-orange rounded-full shrink-0">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </span>
                                <span className="text-white font-bold text-[14px] md:text-[15px] tracking-tight">Starting from <span className="text-orange font-black text-[17px] md:text-[19px]">$497</span></span>
                            </div>
                            <span className="text-[11px] md:text-[12px] text-text-muted font-semibold">one-time setup</span>
                        </div>

                        {/* Trust row — compact, credible */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-[11px] md:text-[12px] text-text-muted/90 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                Live in 48 hrs
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                Full refund guarantee
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                Tax deductible
                            </span>
                        </div>
                    </div>
                </div>

                {/* Video Column - Mobile Order 3 */}
                <div className="w-full mb-2 mt-1 md:my-0 order-3 md:order-none">
                    <div className="bg-navy p-2 rounded-xl md:rounded-[18px] shadow-[0_15px_40px_-10px_rgba(15,23,42,0.35)] transform transition-transform md:hover:scale-[1.02]">
                        <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                            {!isVideoPlaying ? (
                                <button 
                                    type="button" 
                                    className="absolute inset-0 w-full h-full bg-black cursor-pointer border-0 p-0 m-0 group"
                                    onClick={() => setIsVideoPlaying(true)}
                                    aria-label="Play demo video"
                                >
                                    <img 
                                        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} 
                                        alt="Flowio Demo" 
                                        className="w-full h-full object-cover block" 
                                        loading="lazy"
                                    />
                                    <span className="absolute left-1/2 top-1/2 w-[60px] h-[60px] md:w-[68px] md:h-[68px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/95 shadow-xl flex items-center justify-center transition-transform group-hover:scale-110">
                                        <div className="w-0 h-0 border-l-[16px] md:border-l-[18px] border-l-white border-t-[10px] md:border-t-[12px] border-t-transparent border-b-[10px] md:border-b-[12px] border-b-transparent ml-1"></div>
                                    </span>
                                </button>
                            ) : (
                           <iframe
                                  className="absolute inset-0 w-full h-full border-0"
                                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1&controls=1`}
                                  title="Flowio Demo"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                />

                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
