import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `
You are "Jenefa", the advanced AI concierge for Jackson Multifacet, a subsidiary of Real Value & Stakes Limited.
Your tone is ultra-modern, professional, knowledgeable, and slightly futuristic but warm.

Your knowledge base:
1. **Recruitment**: We offer Corporate Staffing (Executive search) and Candidate Placement.
2. **Business Dev**: Services include CV Revamping, Proposal Writing, Branding Strategy, Market Research.
3. **IT Support**: Web & App Development, Technical Support.
4. **Pricing**: 
   - Recruitment: ₦20k - ₦500k (Annual).
   - Candidate Placement: 50% of 1st month salary (Success fee).
   - Creative Services: Proposals start at ₦50,000; Branding at ₦10,000.
   - We are open to negotiation ("Flexible Pricing").

Guidelines:
- Keep answers concise and helpful.
- Use formatting (bolding) for key figures.
- If asked about something outside our scope, politely steer back to our services.
- Always be polite and encourage the user to use the "Contact" form for complex inquiries.
`;

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Greetings. I am Jenefa. How can I assist you with Jackson Multifacet services today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = "gemini-3-flash-preview";

      setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history
      });

      const result = await chat.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const newArr = [...prev];
            const lastMsg = newArr[newArr.length - 1];
            if (lastMsg.role === 'model' && lastMsg.isStreaming) {
              lastMsg.text = fullText;
            }
            return newArr;
          });
        }
      }

      setMessages(prev => {
        const newArr = [...prev];
        const lastMsg = newArr[newArr.length - 1];
        lastMsg.isStreaming = false;
        return newArr;
      });

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm encountering some interference. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button Container */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-4 ${isOpen ? 'hidden' : 'flex'}`}>
        
        {/* Hover Text Bubble */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="hidden md:block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg relative"
        >
          Chat with Jenefa, Our AI
          <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white/10 border-t border-r border-white/20 transform -translate-y-1/2 rotate-45"></div>
        </motion.div>

        <motion.button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-cyan/10 border border-cyan/50 text-cyan shadow-[0_0_20px_rgba(0,212,255,0.3)] backdrop-blur-md transition-all hover:bg-cyan hover:text-midnight hover:shadow-[0_0_30px_rgba(0,212,255,0.6)]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Sparkles size={24} className="animate-pulse" />
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] rounded-2xl backdrop-blur-xl bg-midnight/90 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center border border-cyan/50">
                  <Bot size={18} className="text-cyan" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Jenefa AI</h3>
                  <span className="text-[10px] text-cyan flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"/> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan/20 border border-cyan/30 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.role === 'model' ? (
                      <ReactMarkdown 
                        components={{
                          strong: ({node, ...props}) => <span className="font-bold text-cyan" {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isTyping && messages[messages.length-1].role !== 'model' && (
                 <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-3 rounded-tl-none flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Jenefa..."
                  className="flex-1 bg-midnight/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-cyan/20 border border-cyan/50 rounded-xl text-cyan hover:bg-cyan hover:text-midnight disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;