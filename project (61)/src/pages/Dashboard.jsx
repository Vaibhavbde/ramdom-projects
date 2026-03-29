import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import Timeline from '../components/Timeline';
import FocusTimer from '../components/FocusTimer';
import { useTasks } from '../context/TaskContext';
import { useUser } from '../context/UserContext';
import { Compass, BarChart2, Plus, Zap, Target, User, Save, RefreshCw, Bell, Shield, TrendingUp, Clock, Activity, Download, CheckCircle2, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { tasks, addTask, startFocus } = useTasks();
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Basic Life Score Calculation
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

  const handleImportTemplate = (template) => {
    template.mockTasks.forEach(t => {
      addTask({ ...t, duration: t.duration || 60, priority: t.priority || "medium", energy: t.energy || "medium" });
    });
    alert(`Imported ${template.title} routines into your Dashboard!`);
  };

  const renderContent = () => {
    switch(activeTab) {
      case "Explore":
        return (
          <div className="flex-1 glass-panel p-6 md:p-8 rounded-3xl flex flex-col min-h-0 overflow-y-auto custom-scrollbar gap-6 relative">
            <h3 className="font-semibold text-xl border-b border-white/10 pb-4">Explore Community Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Deep Work Protocol", author: "@huberman", time: "4.5 hrs", uses: "12K+", color: "from-blue-500/20 to-blue-600/5", tags: ["Focus", "Science"], mockTasks: [{title: "Focus Block 1", duration: 90, energy: "high", priority: "high"}, {title: "Zone 2 Cardio", duration: 45, energy: "medium", priority: "medium"}] },
                { title: "Creator's Morning", author: "@aliabdaal", time: "3 hrs", uses: "8.5K+", color: "from-purple-500/20 to-purple-600/5", tags: ["Creative", "Morning"], mockTasks: [{title: "Write Script", duration: 120, energy: "high", priority: "high"}, {title: "Review Edits", duration: 60, energy: "medium", priority: "high"}] },
                { title: "Student Exam Cram", author: "@studytok", time: "8 hrs", uses: "24K+", color: "from-green-500/20 to-green-600/5", tags: ["Study", "Intense"], mockTasks: [{title: "Past Papers", duration: 120, energy: "high", priority: "high"}, {title: "Flashcards", duration: 60, energy: "medium", priority: "medium"}] },
                { title: "Weekend Reset", author: "@saad", time: "5 hrs", uses: "3K+", color: "from-orange-500/20 to-orange-600/5", tags: ["Relax", "Chores"], mockTasks: [{title: "Clean Room", duration: 60, energy: "medium", priority: "low"}, {title: "Read Book", duration: 90, energy: "low", priority: "medium"}] },
              ].map((template, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border border-white/5 bg-gradient-to-br ${template.color} hover:scale-[1.02] transition-transform cursor-pointer group flex flex-col justify-between min-h-[160px]`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{template.title}</h4>
                      <button 
                        onClick={() => handleImportTemplate(template)}
                        className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors group/btn relative"
                      >
                        <Download size={16} />
                        <span className="opacity-0 group-hover/btn:opacity-100 absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[10px] px-2 py-1 rounded whitespace-nowrap">Import workflow</span>
                      </button>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{template.author}</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex gap-1">
                      {template.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-gray-300">{tag}</span>)}
                    </div>
                    <div className="text-xs text-gray-400"><span className="text-white font-semibold">{template.uses}</span> uses</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Analytics":
        const completedHistory = tasks.filter(t => t.status === "completed" && t.completedAt);
        // Parse dates into human-readable strings "Today, Yesterday, Mar 25"
        const groupedHistory = completedHistory.reduce((acc, task) => {
          const dateObj = new Date(task.completedAt);
          const today = new Date();
          const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
          
          let dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          if(dateObj.toDateString() === today.toDateString()) dateStr = "Today";
          else if(dateObj.toDateString() === yesterday.toDateString()) dateStr = "Yesterday";
          
          if(!acc[dateStr]) acc[dateStr] = [];
          acc[dateStr].push(task);
          return acc;
        }, {});
        
        return (
          <div className="flex-1 glass-panel p-6 md:p-8 rounded-3xl flex flex-col min-h-0 overflow-y-auto custom-scrollbar gap-6 relative">
            <h3 className="font-semibold text-xl border-b border-white/10 pb-4">Performance Analytics</h3>
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm"><Activity size={16} className="text-primary" /> Focus Score</div>
                <div className="text-4xl font-black text-white">84<span className="text-lg text-gray-500 font-medium">/100</span></div>
                <div className="text-xs text-green-400 flex items-center gap-1"><TrendingUp size={12}/> +12% this week</div>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm"><Clock size={16} className="text-accent" /> Deep Work Hours</div>
                <div className="text-4xl font-black text-white">32<span className="text-lg text-gray-500 font-medium">hrs</span></div>
                <div className="text-xs text-green-400 flex items-center gap-1"><TrendingUp size={12}/> +4 hrs this week</div>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm"><Target size={16} className="text-danger" /> Task Completion</div>
                <div className="text-4xl font-black text-white">{lifeScore}<span className="text-lg text-gray-500 font-medium">%</span></div>
                <div className="text-xs text-gray-500">Based on today's tasks</div>
              </div>
            </div>

            {/* Mock Chart Area */}
            <div className="bg-black/30 w-full h-64 rounded-2xl border border-white/5 flex items-end p-6 gap-2 sm:gap-4 justify-between relative mt-4">
              <span className="absolute top-4 left-6 text-sm font-semibold text-gray-400">Activity Heatmap</span>
              {[40, 70, 45, 90, 65, 30, 85].map((height, i) => (
                <div key={i} className="w-full bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40 cursor-pointer flex flex-col justify-end" style={{ height: `${height}%` }}>
                  <div className="w-full bg-primary rounded-t-lg" style={{ height: '10%' }}></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap">Day {i+1}</div>
                </div>
              ))}
            </div>

            {/* History Tracker */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="font-semibold text-xl mb-4 text-gray-200">Completed Tasks History</h4>
              
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="p-8 text-center border border-white/5 rounded-2xl bg-black/20 text-gray-500">
                  <CheckCircle2 size={40} className="mx-auto mb-3 opacity-20" />
                  <p>No completed tasks in the history yet. Go get some work done!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {Object.entries(groupedHistory).map(([dateLabel, dayTasks]) => (
                    <div key={dateLabel}>
                      <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-l-2 border-primary pl-3">
                        {dateLabel}
                      </h5>
                      <div className="flex flex-col gap-3">
                        {dayTasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <h6 className="font-semibold text-gray-200 line-through opacity-80 decoration-green-500/50">{task.title}</h6>
                                <p className="text-xs text-gray-500">Completed at {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">{task.duration}m</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "Profile":
        return (
          <div className="flex-1 glass-panel p-6 md:p-8 rounded-3xl flex flex-col min-h-0 relative overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6 sticky top-0 bg-surface/80 backdrop-blur-md z-10 p-2 -mx-2 px-2">
              <h3 className="font-semibold text-xl">Profile Details</h3>
              <button 
                onClick={() => alert("Profile updated successfully! (Mocked DB save)")}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
            
            <div className="max-w-xl flex flex-col gap-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-2xl font-bold text-white uppercase overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-200">Profile Picture</h4>
                  <p className="text-xs text-gray-500 mb-2">JPG, GIF or PNG. Max size 2MB.</p>
                  <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors">
                    Upload new
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-[50%] -translate-y-[50%] text-gray-500" />
                    <input 
                      type="text" 
                      value={user.name}
                      onChange={(e) => updateUser({ name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    value={user.phone}
                    onChange={(e) => updateUser({ phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Email Address (Read-only)</label>
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 px-4 text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Short Bio</label>
                  <textarea 
                    value={user.bio}
                    onChange={(e) => updateUser({ bio: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px] resize-y custom-scrollbar"
                  />
                </div>
              </div>
              
              {/* System Preferences Section (Consolidated from Settings) */}
              <div className="mt-6 border-t border-white/10 pt-6">
                <h4 className="font-semibold text-lg text-gray-200 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-primary" /> System & Preferences
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                      <div className="font-medium text-white">Smart AI Overrides</div>
                      <div className="text-xs text-gray-500">Allow AI to automatically inject longer breaks based on biometric wear loops.</div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                      <div className="font-medium text-white flex items-center gap-2"><Bell size={14} /> Push Notifications</div>
                      <div className="text-xs text-gray-500">Receive alerts when focused sessions end.</div>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                      <div className="font-medium text-white flex items-center gap-2"><RefreshCw size={14} /> Cloud Sync</div>
                      <div className="text-xs text-gray-500">Continuously backup data to the encrypted cloud.</div>
                    </div>
                    <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-gray-400 rounded-full absolute left-0.5 top-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button 
                  onClick={() => updateUser({ isAuthenticated: false })}
                  className="mt-8 w-full bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );
      default: // Dashboard
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Left Column: Tasks & Input */}
            <div className="lg:col-span-1 flex flex-col min-h-0 relative z-10 w-full">
              <TaskInput />
              <TaskList />
            </div>

            {/* Right Column: Timeline Planner */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col flex-1 min-h-0 relative overflow-hidden bg-surface/40 w-full">
              <Timeline />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full h-full bg-background relative selection:bg-primary/30 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 md:pr-8 gap-6 relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full shrink-0 gap-4 mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">
              {activeTab === "Dashboard" ? `Good Morning, ${user.name.split(' ')[0]}` : activeTab}
            </h2>
            <p className="text-sm md:text-base text-gray-400">
              {activeTab === "Dashboard" ? "Let's dominate your day." : 
               activeTab === "Profile" ? "Update your personal details and identity." :
               `Manage your ${activeTab.toLowerCase()} easily.`}  
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Actions Bar */}
            {activeTab === "Dashboard" && (
              <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden glass-panel p-1">
                <button 
                  onClick={() => document.getElementById('task-input')?.focus()}
                  className="px-3 py-1.5 flex items-center gap-2 text-xs font-semibold hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                >
                  <Plus size={14} className="text-primary" /> Add Task
                </button>
                <button 
                  onClick={() => {
                    const plannerBtn = document.getElementById('plan-my-day-btn');
                    if (plannerBtn) plannerBtn.click();
                  }}
                  className="px-3 py-1.5 flex items-center gap-2 text-xs font-semibold hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                >
                  <Zap size={14} className="text-accent" /> Plan My Day
                </button>
                <button 
                  onClick={() => {
                      const firstPending = tasks.find(t => t.status === "pending");
                      if(firstPending) startFocus(firstPending);
                  }}
                  className="px-3 py-1.5 flex items-center gap-2 text-xs font-semibold hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                >
                  <Target size={14} className="text-danger" /> Start Focus
                </button>
              </div>
            )}

            <div className={`text-right glass-panel px-4 py-2 rounded-xl hidden sm:block shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-opacity duration-300 ${activeTab !== "Dashboard" ? "opacity-0 invisible" : ""}`}>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Life Score</span>
              <div className="text-2xl font-black text-accent">{lifeScore}%</div>
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
      
      {/* Absolute Overlays */}
      <FocusTimer />
    </div>
  );
};

export default Dashboard;
