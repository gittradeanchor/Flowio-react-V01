
import React, { useState, useEffect, useRef } from 'react';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0); // 0: Intro, 1: User typed msg, 2: Phone input, 3: Success
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Listen for custom event from header
    useEffect(() => {
        const openHandler = () => setIsOpen(true);
        document.addEventListener('openChat', openHandler);
        return () => document.removeEventListener('openChat', openHandler);
    }, []);

    const handleSubmitMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setStep(2); // Move to phone input
    };

    const handleSubmitPhone = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        // Send to Webhook
        try {
            const webhookUrl = (import.meta as any).env.VITE_MAKE_WEBHOOK_URL;
            if (webhookUrl) {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'chat_inquiry',
                        message: message,
                        phone: phone,
                        timestamp: new Date().toISOString()
                    })
                });
            }
        } catch (err) {
            console.error(err);
        }

        setTimeout(() => {
            setIsSending(false);
            setStep(3); // Success
        }, 1000);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 md:bottom-10 md:right-10 w-[60px] h-[60px] bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 transition-all z-50 animate-fade-in-up"
                aria-label="Chat with us"
            >
                <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.2C16.32 14.08 15.11 13.48 14.89 13.4C14.66 13.32 14.5 13.28 14.33 13.53C14.17 13.78 13.7 14.33 13.56 14.5C13.42 14.66 13.28 14.68 13.03 14.56C12.78 14.44 11.99 14.18 11.05 13.34C10.33 12.7 9.84 11.91 9.7 11.66C9.56 11.41 9.69 11.28 9.81 11.16C9.92 11.05 10.06 10.88 10.19 10.73C10.32 10.58 10.36 10.47 10.44 10.3C10.52 10.14 10.48 9.99 10.42 9.87C10.36 9.75 9.9 8.63 9.71 8.17C9.52 7.73 9.33 7.79 9.19 7.79C9.06 7.79 8.91 7.78 8.76 7.78C8.61 7.78 8.36 7.84 8.15 8.07C7.94 8.3 7.34 8.86 7.34 10C7.34 11.14 8.17 12.24 8.29 12.41C8.41 12.58 9.94 14.94 12.34 15.98C14.67 16.99 15.14 16.79 15.56 16.75C16.36 16.68 17.18 16.23 17.5 15.34C17.82 14.45 17.82 13.69 17.76 13.59C17.7 13.49 17.55 13.43 17.3 13.31H16.57V14.2Z"/>
                </svg>
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 md:bottom-10 md:right-10 w-[90vw] md:w-[350px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-border animate-fade-in font-sans flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="bg-[#075E54] text-white p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">TA</div>
                    <div>
                        <div className="font-bold text-sm">TradeAnchor Support</div>
                        <div className="text-xs opacity-80">Reply time: &lt; 5m</div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">×</button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#E5DDD5] flex-1 overflow-y-auto flex flex-col gap-3 min-h-[300px]">
                
                {/* Bot Intro */}
                <div className="bg-white p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg self-start max-w-[85%] shadow-sm text-sm text-navy">
                    Hi! 👋 I'm the automated assistant. How can I help you today?
                </div>

                {/* User Message */}
                {step >= 1 && (
                    <div className="bg-[#DCF8C6] p-3 rounded-tl-lg rounded-bl-lg rounded-br-lg self-end max-w-[85%] shadow-sm text-sm text-navy">
                        {message}
                    </div>
                )}

                {/* Bot Reply: Ask for phone */}
                {step >= 2 && (
                    <div className="bg-white p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg self-start max-w-[85%] shadow-sm text-sm text-navy">
                        Thanks! I'm just a demo bot, but Sean (Founder) can reply to this via SMS. What's your mobile number?
                    </div>
                )}

                {/* Success */}
                {step === 3 && (
                    <div className="bg-white p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg self-start max-w-[85%] shadow-sm text-sm text-navy">
                        Got it! Sean has been notified and will text you shortly.
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-border shrink-0">
                {step < 2 ? (
                    <form onSubmit={handleSubmitMessage} className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#075E54]"
                            placeholder="Type a message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="w-10 h-10 bg-[#075E54] text-white rounded-full flex items-center justify-center hover:bg-[#064e46]">
                            ➤
                        </button>
                    </form>
                ) : step === 2 ? (
                    <form onSubmit={handleSubmitPhone} className="flex gap-2">
                        <input 
                            type="tel" 
                            className="flex-1 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#075E54]"
                            placeholder="Your mobile number..."
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" disabled={isSending} className="w-10 h-10 bg-[#075E54] text-white rounded-full flex items-center justify-center hover:bg-[#064e46] disabled:opacity-50">
                            {isSending ? '...' : '➤'}
                        </button>
                    </form>
                ) : (
                    <button onClick={() => setIsOpen(false)} className="w-full bg-bg-off text-text-muted py-2 rounded-lg text-sm">Close Chat</button>
                )}
            </div>
        </div>
    );
};
