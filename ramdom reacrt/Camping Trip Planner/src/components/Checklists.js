import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Trash2 } from 'lucide-react';

const Checklists = () => {
  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('camping-checklists');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Essential Camping Gear',
        items: [
          { id: 1, text: 'Tent', completed: true },
          { id: 2, text: 'Sleeping bag', completed: true },
          { id: 3, text: 'Camping stove', completed: false },
          { id: 4, text: 'First aid kit', completed: false },
          { id: 5, text: 'Flashlight', completed: true }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('camping-checklists', JSON.stringify(checklists));
  }, [checklists]);
  const [showForm, setShowForm] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [newItemText, setNewItemText] = useState('');

  const createChecklist = (e) => {
    e.preventDefault();
    if (!newChecklistName.trim()) return;
    
    const newChecklist = {
      id: Date.now(),
      name: newChecklistName,
      items: []
    };
    setChecklists([...checklists, newChecklist]);
    setNewChecklistName('');
    setShowForm(false);
  };

  const addItem = (checklistId, text) => {
    if (!text.trim()) return;
    
    setChecklists(checklists.map(checklist => 
      checklist.id === checklistId 
        ? {
            ...checklist,
            items: [...checklist.items, { id: Date.now(), text, completed: false }]
          }
        : checklist
    ));
  };

  const toggleItem = (checklistId, itemId) => {
    setChecklists(checklists.map(checklist =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : checklist
    ));
  };

  const deleteItem = (checklistId, itemId) => {
    setChecklists(checklists.map(checklist =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: checklist.items.filter(item => item.id !== itemId)
          }
        : checklist
    ));
  };

  const deleteChecklist = (id) => {
    setChecklists(checklists.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-forest-800">Camping Checklists</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Checklist
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-forest-200">
          <h3 className="text-lg font-semibold mb-4 text-forest-800">Create New Checklist</h3>
          <form onSubmit={createChecklist} className="flex gap-2">
            <input
              type="text"
              placeholder="Checklist name"
              value={newChecklistName}
              onChange={(e) => setNewChecklistName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {checklists.map((checklist) => {
          const completedItems = checklist.items.filter(item => item.completed).length;
          const totalItems = checklist.items.length;
          const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

          return (
            <div key={checklist.id} className="bg-white rounded-lg shadow-md border border-forest-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-forest-800">{checklist.name}</h3>
                  <button
                    onClick={() => deleteChecklist(checklist.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{completedItems}/{totalItems}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-forest-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                      <button
                        onClick={() => toggleItem(checklist.id, item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.completed
                            ? 'bg-forest-500 border-forest-500 text-white'
                            : 'border-gray-300 hover:border-forest-400'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3" />}
                      </button>
                      <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => deleteItem(checklist.id, item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addItem(checklist.id, newItemText);
                    setNewItemText('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Add new item..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-forest-600 text-white px-3 py-2 rounded-lg hover:bg-forest-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checklists;