
import React, { useState } from 'react';

export const Hero = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    return (
        <section className="pt-28 pb-8 md:pt-40 md:pb-24 bg-gradient-to-b from-bg-off to-white">
            <div className="container mx-auto px-5 max-w-[1100px] flex flex-col items-start md:grid md:grid-cols-[1fr_1.2fr] gap-4 md:gap-12 md:items-center">
                
                {/* 
                  MOBILE LAYOUT:
                  1. Headline
                  2. Subhead
                  3. Video
                  4. CTA
                */}
                <div className="contents md:block order-1 md:order-none w-full">
                    <h1 className="text-[36px] md:text-[58px] leading-[1.1] font-black text-navy text-left mb-2 md:mb-4 order-1 w-full">
                        Stop doing<br className="block md:hidden"/> paperwork at<br className="block md:hidden"/> <span className="whitespace-nowrap">9:00 PM.</span>
                    </h1>
                    
                    <p className="text-[16px] md:text-[19px] text-text-muted leading-relaxed text-left mb-3 md:mb-8 max-w-[520px] order-2 w-full">
                        Flowio does your quoting, booking, and follow-ups inside Google Sheets you already use.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col items-start gap-4 md:gap-5 w-full md:w-auto order-4 md:order-none mt-2 md:mt-0">
                        <a href="#test-drive" className="flex items-center justify-center btn w-full md:w-auto px-8 py-4 min-h-[60px] text-lg font-bold text-white rounded-xl shadow-btn-primary hover:shadow-lg active:translate-y-0.5 transition-all relative overflow-hidden shine-effect bg-gradient-to-br from-orange to-orange-hover">
                            Test Drive It (30s)
                        </a>
                        
                        <div className="text-sm text-text-muted flex flex-col gap-1.5 items-start text-left">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green rounded-full shrink-0"></span>
                                <span className="font-medium text-navy">100% Google Native. Zero Learning Curve.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green rounded-full shrink-0"></span>
                                <span>No subscription - one-time setup</span>
                            </div>
                        </div>

                        {/* Platform Trust Badges */}
                        <div className="flex items-center justify-start gap-3 mt-2 md:mt-4 pt-3 md:pt-4 border-t border-border w-full">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Secured By:</span>
                            <div className="flex items-center gap-4 opacity-70 grayscale transition-all hover:grayscale-0">
                                <img src="https://placehold.co/80x25/transparent/A0AEC0?text=Google" alt="Google" className="h-5 md:h-6 w-auto" />
                                <img src="https://placehold.co/80x25/transparent/A0AEC0?text=Stripe" alt="Stripe" className="h-5 md:h-6 w-auto" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Column - Mobile Order 3 */}
                <div className="w-full my-1 md:my-0 order-3 md:order-none">
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
                                        className="w-full h-full object-cover block opacity-80 group-hover:opacity-100 transition-opacity" 
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
