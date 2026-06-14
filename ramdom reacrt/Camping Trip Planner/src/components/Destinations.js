import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Trash2 } from 'lucide-react';

const Destinations = () => {
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('camping-destinations');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Yosemite National Park',
        location: 'California, USA',
        rating: 5,
        description: 'Stunning granite cliffs, waterfalls, and giant sequoias.',
        activities: ['Hiking', 'Rock Climbing', 'Photography']
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('camping-destinations', JSON.stringify(destinations));
  }, [destinations]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    description: '',
    activities: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDestination = {
      id: Date.now(),
      ...formData,
      activities: formData.activities.split(',').map(a => a.trim()).filter(a => a)
    };
    setDestinations([...destinations, newDestination]);
    setFormData({ name: '', location: '', rating: 5, description: '', activities: '' });
    setShowForm(false);
  };

  const deleteDestination = (id) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-forest-800">Camping Destinations</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-forest-200">
          <h3 className="text-lg font-semibold mb-4 text-forest-800">Add New Destination</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Destination name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              rows="3"
            />
            <input
              type="text"
              placeholder="Activities (comma-separated)"
              value={formData.activities}
              onChange={(e) => setFormData({...formData, activities: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700"
              >
                Add Destination
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-md border border-forest-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-forest-800">{destination.name}</h3>
                <button
                  onClick={() => deleteDestination(destination.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{destination.location}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < destination.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-3">{destination.description}</p>
              <div className="flex flex-wrap gap-1">
                {destination.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="bg-forest-100 text-forest-700 px-2 py-1 rounded-full text-xs"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;