
import React, { useState } from 'react';

export const Hero = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    return (
        <section className="pt-40 pb-10 md:pt-44 md:pb-24 bg-gradient-to-b from-bg-off to-white">
            <div className="container mx-auto px-5 max-w-[1100px] flex flex-col items-start md:grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-12 md:items-center">
                
                {/* 
                  MOBILE LAYOUT:
                  1. Headline
                  2. Subhead
                  3. Video
                  4. CTA
                */}
                <div className="contents md:block order-1 md:order-none w-full">
                    <h1 className="text-[36px] md:text-[58px] leading-[1.1] font-black text-navy text-left mb-3 md:mb-4 order-1 w-full mt-2 md:mt-0">
                        Stop doing<br className="block md:hidden"/> paperwork at<br className="block md:hidden"/> <span className="whitespace-nowrap">9:00 PM.</span>
                    </h1>
                    
                    <ul className="text-[16px] md:text-[19px] text-text-muted leading-relaxed text-left mb-6 md:mb-8 max-w-[580px] order-2 w-full list-none space-y-2">
                        <li className="flex items-start gap-2">
                            <span>Quote → send → client accepts → job booked in Google Calendar.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span>Auto SMS follow-ups. Runs in Google Sheets. No subscription.</span>
                        </li>
                    </ul>

                    {/* CTA Group */}
                    <div className="flex flex-col items-start gap-0 w-full md:w-auto order-4 md:order-none mt-4 md:mt-0">
                        <a href="#test-drive" className="flex items-center justify-center btn w-full md:w-auto px-8 py-4 min-h-[60px] text-lg font-bold text-white rounded-xl shadow-btn-primary hover:shadow-lg active:translate-y-0.5 transition-all relative overflow-hidden shine-effect bg-gradient-to-br from-orange to-orange-hover mb-3">
                            Launch Free Live Simulator ▸
                        </a>
                        
                        {/* Subtext 1 */}
                        <p className="text-xs text-text-muted font-medium mb-1 w-full text-center md:text-left opacity-90">
                            (Run the full workflow • No credit card required)
                        </p>
                         {/* Subtext 2 */}
                        <p className="text-xs text-text-muted font-medium mb-5 w-full text-center md:text-left opacity-90">
                            (You’ll receive a real quote link by SMS + email...)
                        </p>
                        
                        
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Column - Mobile Order 3 */}
                <div className="w-full my-4 md:my-0 order-3 md:order-none">
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
                                        src="https://i.ytimg.com/vi/Z2NO3qIiP5c/maxresdefault.jpg" 
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
                                    src="https://www.youtube-nocookie.com/embed/Z2NO3qIiP5c?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1&controls=1"
                                    title="Flowio Demo"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
