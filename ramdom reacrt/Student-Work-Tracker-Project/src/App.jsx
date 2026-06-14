import { useState, useEffect } from 'react';

// TaskCard Component
function TaskCard({ task, onUpdateStatus, onDelete, onEdit }) {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    High: 'bg-red-100 text-red-800 border-red-300'
  };

  const statusColors = {
    Pending: 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDue(task.dueDate);
  const isOverdue = daysLeft < 0 && task.status !== 'Completed';
  const isDueSoon = daysLeft >= 0 && daysLeft <= 3 && task.status !== 'Completed';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isOverdue ? 'border-red-500' : isDueSoon ? 'border-yellow-500' : 'border-blue-500'
    } hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{task.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{task.subject}</p>
          {task.notes && (
            <p className="text-gray-500 text-xs italic">{task.notes}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="mb-4 space-y-1">
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Due:</span> {formatDate(task.dueDate)}
        </p>
        {isOverdue && (
          <p className="text-xs text-red-600 font-semibold">⚠️ Overdue by {Math.abs(daysLeft)} days</p>
        )}
        {isDueSoon && !isOverdue && (
          <p className="text-xs text-yellow-600 font-semibold">⏰ Due in {daysLeft} day(s)</p>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {task.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${statusColors[task.status]} border-none cursor-pointer flex-1`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// TaskList Component
function TaskList({ tasks, onUpdateStatus, onDelete, onEdit, sortBy, filterStatus, filterPriority, searchQuery }) {
  let filteredTasks = [...tasks];

  // Apply search filter
  if (searchQuery) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Apply status filter
  if (filterStatus !== 'All') {
    filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
  }

  // Apply priority filter
  if (filterPriority !== 'All') {
    filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
  }

  // Apply sorting
  filteredTasks.sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortBy === 'subject') {
      return a.subject.localeCompare(b.subject);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-500 text-lg">
          {tasks.length === 0 ? 'No tasks yet. Add your first task above!' : 'No tasks match your filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

// AddTask Component
function AddTask({ onAddTask, editingTask, onCancelEdit, onUpdateTask }) {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
    notes: '',
    tags: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        subject: editingTask.subject,
        title: editingTask.title,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority,
        status: editingTask.status,
        notes: editingTask.notes || '',
        tags: editingTask.tags ? editingTask.tags.join(', ') : ''
      });
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!formData.subject || !formData.title || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const taskData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    if (editingTask) {
      onUpdateTask({ ...editingTask, ...taskData });
    } else {
      onAddTask(taskData);
    }
    
    setFormData({
      subject: '',
      title: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending',
      notes: '',
      tags: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setFormData({
      subject: '',
      title: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending',
      notes: '',
      tags: ''
    });
    onCancelEdit();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete Chapter 5 exercises"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (Optional, comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., homework, exam, project"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold text-lg"
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button
              onClick={handleCancel}
              className="px-6 bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 transition-colors font-semibold text-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const savedTasks = localStorage.getItem('studentTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studentTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...taskData
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearCompleted = () => {
    if (window.confirm('Delete all completed tasks?')) {
      setTasks(tasks.filter(task => task.status !== 'Completed'));
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => {
      const daysLeft = Math.ceil((new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft < 0 && t.status !== 'Completed';
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Student Work Tracker</h1>
          <p className="text-gray-600">Organize and track your academic tasks efficiently</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-gray-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </div>

        <AddTask 
          onAddTask={handleAddTask} 
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
          onUpdateTask={handleUpdateTask}
        />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
            <div className="flex gap-2">
              <button
                onClick={handleClearCompleted}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Clear Completed
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Export Data
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="subject">Subject</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <TaskList
          tasks={tasks}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          sortBy={sortBy}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}