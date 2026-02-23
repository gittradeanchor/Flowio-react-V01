
import React, { useState } from 'react';


export const Hero = () => {
    const videoId = import.meta.env.VITE_YOUTUBE_ID;
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    if (!videoId) return null; // or render a fallback block
    return (
        <section className="pt-10 pb-5 md:pt-20 md:pb-12 bg-gradient-to-b from-bg-off to-white">
            {/* Hero-only top bar with logo — visible when header is hidden (before scroll) */}
            <div className="container mx-auto px-5 max-w-[1100px] mb-4 md:mb-7">
                <div className="flex items-center justify-between">
                    <img src="/tradeanchor-logo.png" alt="TradeAnchor" className="h-8 md:h-11" />
                </div>
            </div>

            <div className="container mx-auto px-5 max-w-[1100px] flex flex-col items-center md:grid md:grid-cols-[1fr_1.2fr] gap-4 md:gap-12 md:items-center">

                {/*
                  MOBILE LAYOUT ORDER:
                  1. Eyebrow + Headline + Sub
                  2. Video
                  3. CTA + Price + Micro-copy
                */}
                <div className="contents md:block order-1 md:order-none w-full">

                    {/* Eyebrow tag */}
                    <div className="flex items-center gap-2 mb-3 md:mb-4 order-1 w-full justify-center md:justify-start">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange/8 border border-orange/20 rounded-full text-[11px] md:text-[12px] uppercase tracking-[0.12em] font-bold text-orange">
                            <span className="w-1.5 h-1.5 bg-orange rounded-full"></span>
                            Aussie Tradies
                        </span>
                    </div>

                    <h1 className="text-[32px] md:text-[54px] leading-[1.08] font-black text-navy text-center md:text-left mb-3 md:mb-5 order-1 w-full mt-0">
                        Stop doing<br className="block md:hidden"/> paperwork at<br className="block md:hidden"/> <span className="whitespace-nowrap">9:00 PM.</span>
                    </h1>

                    {/* Subheadline Section */}
                    <div className="text-center md:text-left mb-4 md:mb-6 max-w-[540px] order-2 w-full">
                        <p className="text-[16px] md:text-[20px] font-semibold text-navy/80 mb-1.5 md:mb-2 leading-snug">
                            Send quote ▸ client accepts ▸ job booked.
                        </p>
                        <p className="text-[13px] md:text-[15px] text-text-muted font-medium leading-relaxed">
                            One-time setup · Runs inside your Google Sheets · You own everything
                        </p>
                    </div>

                    {/* Price anchor */}
                    <p className="text-[13px] text-text-muted font-medium text-center md:text-left mb-4 order-2 w-full max-w-[540px]">
                        Starting from <span className="font-bold text-navy">$497</span> · one-time setup
                    </p>

                    {/* CTA row */}
                    <div className="flex flex-col items-center md:items-start w-full md:w-auto order-4 md:order-none mt-1 md:mt-0">
                        <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 w-full md:w-auto mb-2">
                            <a href="#test-drive" className="flex items-center justify-center btn w-full sm:w-auto px-6 py-3.5 min-h-[52px] text-base font-bold text-white rounded-xl shadow-btn-primary hover:shadow-lg active:translate-y-0.5 transition-all relative overflow-hidden shine-effect bg-gradient-to-br from-orange to-orange-hover">
                                Run a Live Demo (30s) <span className="ml-2 text-2xl leading-[0] pb-1">▸</span>
                            </a>
                            <a
                                href={import.meta.env.VITE_CALENDLY_URL || '#offer'}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 min-h-[52px] text-base font-bold text-navy border-2 border-navy/20 rounded-xl hover:border-navy/35 transition-colors bg-white"
                            >
                                Book a Fit Call <span className="ml-1.5 text-[13px]">→</span>
                            </a>
                        </div>

                        {/* What happens after click — reduces friction */}
                        <p className="text-[12px] md:text-[13px] text-text-muted text-center md:text-left w-full">
                            Build a real quote below — we'll text it to your phone with a live accept link.
                        </p>

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
