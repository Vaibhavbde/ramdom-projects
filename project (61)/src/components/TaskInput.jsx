import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { parseTaskInput } from '../utils/parser';
import { Mic, Send, Plus, Zap } from 'lucide-react';

const TaskInput = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { addTask } = useTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Parse natural language and add task
    const parsedTask = parseTaskInput(text);
    addTask(parsedTask);
    setText('');
  };

  const toggleListening = () => {
    if (isListening) {
      if (window.currentRecognition) {
        window.currentRecognition.stop();
        setIsListening(false);
      }
    } else {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Voice capture not supported in this browser.");
        return;
      }
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      let baseText = text ? text + " " : "";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setText(baseText + transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      window.currentRecognition = recognition;
      setIsListening(true);
      recognition.start();
    }
  };

  return (
    <div className="glass-panel p-4 md:p-5 rounded-2xl w-full border border-white/5 bg-surface/60 backdrop-blur-2xl transition-all hover:bg-surface/80 flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase flex items-center gap-2">
          {isListening ? (
            <span className="text-danger flex items-center gap-2 animate-pulse">
              <Mic size={14} /> Listening to your voice...
            </span>
          ) : (
            <>
              <Zap size={14} className="text-primary" />
              Flow Capture
            </>
          )}
        </label>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative flex items-center">
          <input
            id="task-input"
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm md:text-base font-medium shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
            placeholder={isListening ? "Speak now..." : "e.g., Study React for 2 hours high priority"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="button"
            className={`absolute right-2 p-2 rounded-lg transition-colors flex items-center justify-center ${isListening ? 'text-danger bg-danger/20 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            onClick={toggleListening}
            title={isListening ? "Click to stop" : "Click to speak"}
          >
            <Mic size={18} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="text-[11px] text-gray-500 font-mono hidden sm:block">
            NLP AUTO-PARSING ENABLED: <br></br>captures priority, duration & <br></br>time automatically.
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group shrink-0 whitespace-nowrap min-w-[140px] shadow-lg shadow-primary/20 ml-auto"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform text-white/80" />
            <span className="text-sm">Enter Flow</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;
