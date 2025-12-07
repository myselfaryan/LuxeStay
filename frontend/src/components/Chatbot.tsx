import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { ApiService } from '../services/apiService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Yo! I'm your digital concierge. Need a room or just wanna chat?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await ApiService.sendChatMessage(userMessage.text);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.message || "I'm sorry, I couldn't process that request.",
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the server. Please try again later.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 p-4 bg-pop-pink text-pop-black border-3 border-pop-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-300 transform ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <MessageSquare className="w-8 h-8" />
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white border-3 border-pop-black shadow-neo-lg flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-pop-yellow border-b-3 border-pop-black p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-pop-black border-2 border-pop-black shadow-neo-sm">
                            <Sparkles className="w-5 h-5 text-pop-yellow" />
                        </div>
                        <div>
                            <h3 className="font-display font-black uppercase text-lg text-pop-black leading-none">Concierge</h3>
                            <p className="text-xs font-bold text-gray-600 flex items-center mt-1">
                                <span className="w-2 h-2 bg-green-500 border border-pop-black rounded-full mr-1.5 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-pop-black hover:text-pop-pink transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-4 text-sm font-bold shadow-neo-sm border-2 border-pop-black ${msg.sender === 'user'
                                    ? 'bg-pop-blue text-pop-black rounded-none transform rotate-1'
                                    : 'bg-gray-100 text-pop-black rounded-none transform -rotate-1'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 p-4 border-2 border-pop-black shadow-neo-sm flex items-center space-x-2 transform -rotate-1">
                                <Loader2 className="w-4 h-4 animate-spin text-pop-black" />
                                <span className="text-xs font-bold text-gray-500 uppercase">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-pop-purple border-t-3 border-pop-black">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask about rooms..."
                            className="w-full pl-4 pr-14 py-4 bg-white border-2 border-pop-black font-bold text-pop-black placeholder-gray-400 focus:outline-none focus:bg-pop-yellow/20 transition-all shadow-neo-sm"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || isLoading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-pop-mint text-pop-black border-2 border-pop-black shadow-neo hover:bg-pop-pink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[10px] font-black uppercase text-pop-black/50 tracking-wider">Powered by Gemini AI</p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Chatbot;
