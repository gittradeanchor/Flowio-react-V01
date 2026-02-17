
import React, { useState } from 'react';


export const Hero = () => {
    const videoId = import.meta.env.VITE_YOUTUBE_ID;
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    
    if (!videoId) return null; // or render a fallback block
    return (
        <section className="pt-20 pb-5 md:pt-32 md:pb-12 bg-gradient-to-b from-bg-off to-white">
            <div className="container mx-auto px-5 max-w-[1100px] flex flex-col items-center md:grid md:grid-cols-[1fr_1.2fr] gap-4 md:gap-12 md:items-center">
                
                {/* 
                  MOBILE LAYOUT:
                  1. Headline
                  2. Subhead
                  3. Video
                  4. CTA
                */}
                <div className="contents md:block order-1 md:order-none w-full">
                    <h1 className="text-[34px] md:text-[58px] leading-[1.1] font-black text-navy text-left md:text-left mb-1 md:mb-4 order-1 w-full mt-0">
                        Stop doing<br className="block md:hidden"/> paperwork at<br className="block md:hidden"/> <span className="whitespace-nowrap">9:00 PM.</span>
                    </h1>
                    
                    {/* Subheadline Section */}
                    <div className="text-[15px] md:text-[19px] text-text-muted leading-relaxed text-left md:text-left mb-4 md:mb-8 max-w-[580px] order-2 w-full">
                        {/* Process Line */}
                        <p className="mb-2 md:mb-3 font-medium text-navy/80 block">
                            Send quote ▸ client accepts ▸ job booked.
                        </p>

                        {/* 3 Bullet Points in a compact flex layout to preserve height (2 lines) */}
                        <ul className="list-none flex flex-wrap gap-x-6 gap-y-1 md:gap-y-2 p-0 m-0">
                            <li className="flex items-center gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                                <span>Runs in Google Sheets</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                                <span>No subscription</span>
                            </li>
                            <li className="flex items-center gap-2.5 w-full md:w-auto">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                                <span>Auto SMS follow-ups</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA Group */}
                    <div className="flex flex-col items-center md:items-start gap-0 w-full md:w-auto order-4 md:order-none mt-1 md:mt-0">
                        {/* 
                           w-full: Full width on mobile
                           md:w-auto: Auto width on desktop (prevents stretching to container width)
                           md:min-w-[360px]: Enforces a wide button look on desktop
                        */}
                        <a href="#test-drive" className="flex items-center justify-center btn w-full md:w-auto md:min-w-[360px] px-8 py-4 min-h-[60px] text-lg font-bold text-white rounded-xl shadow-btn-primary hover:shadow-lg active:translate-y-0.5 transition-all relative overflow-hidden shine-effect bg-gradient-to-br from-orange to-orange-hover mb-2 md:mb-3">
                            Run a Live Demo (30s) <span className="ml-3 text-4xl leading-[0] pb-2">▸</span>
                        </a>

                        {/* Price Anchor — immediately under CTA, above fold on mobile */}
                        <p className="text-[13px] text-navy/70 font-semibold mb-2 w-full text-center md:text-left">
                            Starting from $497 · One-time · No subscription
                        </p>

                        {/* Subtext — below fold on mobile, visible on desktop */}
                        <p className="hidden md:block text-[13px] text-text-muted font-medium mb-1 w-full text-left opacity-95">
                            ✅ Experience the full workflow • No credit card
                        </p>
                        <p className="hidden md:block text-[13px] text-text-muted font-medium mb-0 w-full text-left opacity-95">
                            📩 You'll receive a live quote by SMS + email
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
