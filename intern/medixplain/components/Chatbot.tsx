import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';
import Icon from './shared/Icon';

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      const API_KEY = process.env.API_KEY;
      if (!API_KEY) {
        console.error("API_KEY not set");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly and helpful AI Health Assistant. Provide clear, concise, and safe health advice, nutrition tips, and exercise recommendations. Always include a disclaimer that you are not a medical professional and users should consult a doctor for medical advice.',
        },
      });
      setChat(chatInstance);
      setMessages([{
        role: 'model',
        text: 'Hello! I am your AI Health Assistant. How can I help you today? Feel free to ask about symptoms, nutrition, or exercise.'
      }]);
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: input });
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of result) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = modelResponse;
            return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Chatbot Health Assistant</h1>
        <p className="text-gray-600 mb-4">Your 24/7 AI-powered health companion.</p>

        <div className="flex-1 overflow-y-auto bg-white p-4 rounded-xl shadow-md space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <div className="bg-gray-200 p-2 rounded-full"><Icon name="bot" className="w-6 h-6 text-gray-600"/></div>}
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm break-words">{msg.text}</p>
                </div>
                {msg.role === 'user' && <div className="bg-blue-100 p-2 rounded-full"><Icon name="user" className="w-6 h-6 text-blue-600"/></div>}
            </div>
            ))}
            {loading && messages[messages.length-1].role === 'user' && (
                <div className="flex items-start gap-3">
                    <div className="bg-gray-200 p-2 rounded-full"><Icon name="bot" className="w-6 h-6 text-gray-600"/></div>
                    <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex items-center bg-white p-2 rounded-xl shadow-md">
            <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Ask a health question..."
            className="flex-1 p-3 border-none focus:ring-0"
            disabled={loading}
            />
            <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
            <Icon name="send" className="w-6 h-6" />
            </button>
      </div>
    </div>
  );
};

export default Chatbot;
