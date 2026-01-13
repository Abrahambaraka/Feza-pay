
import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/geminiService';

const AppAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Bonjour ! Je suis votre assistant Feza Pay. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = messages.slice(-5);
    const response = await getFinancialAdvice(userMsg, history);

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: response || '' }]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-background-dark rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined">smart_toy</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[60] flex flex-col max-w-md mx-auto">
          <div className="flex-1 flex flex-col bg-background-light dark:bg-surface-dark mt-20 rounded-t-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background-dark">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistant Feza Pay</h3>
                  <p className="text-xs text-primary">En ligne</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${m.role === 'user'
                      ? 'bg-primary text-background-dark rounded-tr-none'
                      : 'bg-slate-200 dark:bg-background-dark text-slate-800 dark:text-white rounded-tl-none'
                    }`}>
                    <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-200 dark:bg-background-dark px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 dark:bg-background-dark border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-white dark:bg-surface-dark border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  className="bg-primary text-background-dark w-12 h-12 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppAssistant;
