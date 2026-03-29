// src/components/Sidebar.jsx
import React from 'react';
import { Home, Compass, BarChart2, User, Layers } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { tasks } = useTasks();
  
  // Calculate Life Score only for TODAY's tasks
  const todayTasks = tasks.filter(t => {
    if (t.status === "pending") return true;
    if (t.status === "completed" && t.completedAt) {
      const dateObj = new Date(t.completedAt);
      const today = new Date();
      return dateObj.toDateString() === today.toDateString();
    }
    return false;
  });
  
  const completedCount = todayTasks.filter(t => t.status === "completed").length;
  const totalCount = todayTasks.length;
  const lifeScore = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const navItems = [
    { id: "Dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { id: "Explore", icon: <Compass size={20} />, label: "Explore" },
    { id: "Analytics", icon: <BarChart2 size={20} />, label: "Analytics" },
    { id: "Profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="w-64 h-full bg-surface/50 border-r border-white/5 backdrop-blur-xl flex flex-col p-6 shrink-0 relative overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-3.5 mb-10 relative z-10 px-2 cursor-pointer group">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-primary/40 blur-[12px] rounded-2xl group-hover:bg-primary/60 transition-all duration-300 group-hover:scale-110" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] relative z-10 border border-white/20 transition-transform">
            <Layers size={20} className="text-white drop-shadow-md" />
          </div>
        </div>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight flex items-baseline pb-1">
          LifeStack<span className="text-primary text-4xl leading-[0] tracking-tighter ml-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">.</span>
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2 relative z-10">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary font-medium border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title={item.label}
            >
              {item.icon}
              <span className="hidden md:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden md:block glass-panel p-4 rounded-2xl border-white/5 bg-black/40">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Life Score</span>
          <span className="text-accent font-bold text-sm">{lifeScore}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out" 
            style={{ width: `${lifeScore}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          Complete tasks & focus to level up.
        </p>
      </div>
      
      {/* Mobile profile icon placeholder */}
      <div className="mt-auto md:hidden flex justify-center pb-2">
        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
          <User size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
