import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Trash2, Bot, User, Loader2, Terminal } from 'lucide-react';
import { sendMessageToChat, resetChat } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Pixel OS Chat Terminal v2.4 initialized. Ready for input.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await sendMessageToChat(userMessage);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: Connection lost or API limit reached.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    resetChat();
    setMessages([{ role: 'ai', text: 'Memory cleared. New session started.' }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_#000] mb-6 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
           <div className="bg-[#FF5500] text-white p-2 border-2 border-black">
              <Terminal size={20} />
           </div>
           <div>
              <h2 className="text-xl font-black text-black uppercase font-['Press_Start_2P'] leading-none">
                AI CHAT
              </h2>
              <p className="text-xs font-bold font-mono mt-1">> TERMINAL_MODE</p>
           </div>
        </div>
        <button 
           onClick={handleReset}
           className="text-xs font-bold text-red-600 hover:text-black uppercase border-b-2 border-transparent hover:border-black transition-colors flex items-center gap-1"
         >
           <Trash2 size={14} /> [ CLEAR MEMORY ]
         </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-50 border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden flex flex-col relative">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none"></div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
               {msg.role === 'ai' && (
                  <div className="w-8 h-8 bg-black flex-shrink-0 flex items-center justify-center border-2 border-black">
                     <Bot size={16} className="text-white" />
                  </div>
               )}
               
               <div className={`max-w-[80%] p-4 border-2 border-black font-mono text-sm leading-relaxed ${
                 msg.role === 'user' 
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_#999]' 
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_#FF5500]'
               }`}>
                  {msg.text}
               </div>

               {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-white flex-shrink-0 flex items-center justify-center border-2 border-black">
                     <User size={16} className="text-black" />
                  </div>
               )}
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-black flex-shrink-0 flex items-center justify-center border-2 border-black">
                    <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#FF5500] flex items-center gap-2">
                    <div className="w-2 h-2 bg-black animate-bounce"></div>
                    <div className="w-2 h-2 bg-black animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-black animate-bounce delay-200"></div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t-4 border-black p-4 z-20">
           <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your command..."
                disabled={isTyping}
                className="flex-1 bg-gray-50 border-2 border-black p-4 font-mono font-bold focus:shadow-[4px_4px_0px_0px_#FF5500] outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className={`px-6 border-2 border-black font-black uppercase flex items-center justify-center transition-all ${
                   isTyping || !input.trim() 
                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                   : 'bg-[#FF5500] text-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1'
                }`}
              >
                 <Send size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;