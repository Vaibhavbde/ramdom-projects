import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, Trash2, Edit3 } from 'lucide-react';

const Itineraries = () => {
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('camping-itineraries');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Yosemite Weekend Trip',
        startDate: '2024-07-15',
        endDate: '2024-07-17',
        destination: 'Yosemite National Park',
        activities: [
          { id: 1, day: 1, time: '09:00', activity: 'Arrive and set up camp', location: 'Upper Pines Campground' },
          { id: 2, day: 1, time: '14:00', activity: 'Hike to Vernal Fall', location: 'Mist Trail' },
          { id: 3, day: 2, time: '06:00', activity: 'Sunrise at Glacier Point', location: 'Glacier Point' },
          { id: 4, day: 2, time: '10:00', activity: 'Valley Floor Loop', location: 'Yosemite Valley' },
          { id: 5, day: 3, time: '08:00', activity: 'Pack up and departure', location: 'Campground' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('camping-itineraries', JSON.stringify(itineraries));
  }, [itineraries]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    destination: ''
  });
  // Per-day activity states - each day gets its own form state
  const [dayActivityStates, setDayActivityStates] = useState({});

  // Helper functions for time formatting
  const formatTimeToAMPM = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTimeFrom12to24 = (hour, minute, ampm) => {
    let hour24 = parseInt(hour);
    if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampm === 'AM' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  // Get or initialize state for a specific day
  const getDayState = (itineraryId, day) => {
    const key = `${itineraryId}-${day}`;
    return dayActivityStates[key] || {
      time: '',
      activity: '',
      location: '',
      timePickerState: { hour: '12', minute: '00', ampm: 'AM' },
      useDropdownTime: true,
      customTimeInput: ''
    };
  };

  // Update state for a specific day
  const updateDayState = (itineraryId, day, updates) => {
    const key = `${itineraryId}-${day}`;
    setDayActivityStates(prev => ({
      ...prev,
      [key]: { ...getDayState(itineraryId, day), ...updates }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItinerary = {
      id: Date.now(),
      ...formData,
      activities: []
    };
    setItineraries([...itineraries, newItinerary]);
    setFormData({ title: '', startDate: '', endDate: '', destination: '' });
    setShowForm(false);
  };

  const addActivity = (itineraryId, day) => {
    const dayState = getDayState(itineraryId, day);
    if (!dayState.time || !dayState.activity) return;
    
    const newActivity = {
      id: Date.now(),
      day: day,
      time: dayState.time,
      activity: dayState.activity,
      location: dayState.location
    };
    
    setItineraries(itineraries.map(itinerary =>
      itinerary.id === itineraryId
        ? {
            ...itinerary,
            activities: [...itinerary.activities, newActivity]
          }
        : itinerary
    ));
    
    // Clear the form for this specific day
    updateDayState(itineraryId, day, {
      time: '',
      activity: '',
      location: '',
      timePickerState: { hour: '12', minute: '00', ampm: 'AM' },
      customTimeInput: ''
    });
  };

  const deleteActivity = (itineraryId, activityId) => {
    setItineraries(itineraries.map(itinerary =>
      itinerary.id === itineraryId
        ? {
            ...itinerary,
            activities: itinerary.activities.filter(activity => activity.id !== activityId)
          }
        : itinerary
    ));
  };

  const deleteItinerary = (id) => {
    setItineraries(itineraries.filter(i => i.id !== id));
  };

  const getDayLabel = (startDate, dayNumber) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNumber - 1);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-forest-800">Trip Itineraries</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Itinerary
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-forest-200">
          <h3 className="text-lg font-semibold mb-4 text-forest-800">Create New Itinerary</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Trip title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700"
              >
                Create Itinerary
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

      <div className="space-y-6">
        {itineraries.map((itinerary) => {
          const days = getDuration(itinerary.startDate, itinerary.endDate);
          const activitiesByDay = {};
          
          for (let i = 1; i <= days; i++) {
            activitiesByDay[i] = itinerary.activities.filter(activity => activity.day === i);
          }

          return (
            <div key={itinerary.id} className="bg-white rounded-lg shadow-md border border-forest-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-forest-800">{itinerary.title}</h3>
                    <div className="flex items-center gap-4 text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{itinerary.destination}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItinerary(itinerary.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {Array.from({ length: days }, (_, i) => i + 1).map(day => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-forest-700 mb-3">
                        Day {day} - {getDayLabel(itinerary.startDate, day)}
                      </h4>
                      
                      <div className="space-y-2 mb-3">
                        {activitiesByDay[day]?.map((activity) => (
                          <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-1 text-forest-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{formatTimeToAMPM(activity.time)}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-800">{activity.activity}</span>
                              {activity.location && (
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                  <MapPin className="w-3 h-3" />
                                  <span>{activity.location}</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteActivity(itinerary.id, activity.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const dayState = getDayState(itinerary.id, day);
                          return (
                            <>
                              <div className="flex gap-1 items-center">
                                {dayState.useDropdownTime ? (
                                  <>
                                    <select
                                      value={dayState.timePickerState.hour}
                                      onChange={(e) => {
                                        const newTimeState = {...dayState.timePickerState, hour: e.target.value};
                                        const time24 = formatTimeFrom12to24(newTimeState.hour, newTimeState.minute, newTimeState.ampm);
                                        updateDayState(itinerary.id, day, {
                                          timePickerState: newTimeState,
                                          time: time24
                                        });
                                      }}
                                      className="border border-gray-300 rounded px-1 py-1 text-sm w-10"
                                    >
                                      {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                      ))}
                                    </select>
                                    <span className="text-sm">:</span>
                                    <select
                                      value={dayState.timePickerState.minute}
                                      onChange={(e) => {
                                        const newTimeState = {...dayState.timePickerState, minute: e.target.value};
                                        const time24 = formatTimeFrom12to24(newTimeState.hour, newTimeState.minute, newTimeState.ampm);
                                        updateDayState(itinerary.id, day, {
                                          timePickerState: newTimeState,
                                          time: time24
                                        });
                                      }}
                                      className="border border-gray-300 rounded px-1 py-1 text-sm w-12"
                                    >
                                      {['00', '15', '30', '45'].map(minute => (
                                        <option key={minute} value={minute}>{minute}</option>
                                      ))}
                                    </select>
                                    <select
                                      value={dayState.timePickerState.ampm}
                                      onChange={(e) => {
                                        const newTimeState = {...dayState.timePickerState, ampm: e.target.value};
                                        const time24 = formatTimeFrom12to24(newTimeState.hour, newTimeState.minute, newTimeState.ampm);
                                        updateDayState(itinerary.id, day, {
                                          timePickerState: newTimeState,
                                          time: time24
                                        });
                                      }}
                                      className="border border-gray-300 rounded px-1 py-1 text-sm w-12"
                                    >
                                      <option value="AM">AM</option>
                                      <option value="PM">PM</option>
                                    </select>
                                  </>
                                ) : (
                                  <input
                                    type="text"
                                    placeholder="2:30 PM"
                                    value={dayState.customTimeInput}
                                    onChange={(e) => {
                                      const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
                                      const match = e.target.value.match(timeRegex);
                                      const updates = { customTimeInput: e.target.value };
                                      if (match) {
                                        const [, hour, minute, ampm] = match;
                                        const time24 = formatTimeFrom12to24(hour, minute, ampm.toUpperCase());
                                        updates.time = time24;
                                      }
                                      updateDayState(itinerary.id, day, updates);
                                    }}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newUseDropdown = !dayState.useDropdownTime;
                                    const updates = { useDropdownTime: newUseDropdown };
                                    
                                    if (newUseDropdown && dayState.time) {
                                      // Switching to dropdown, sync current time
                                      const [hours, minutes] = dayState.time.split(':');
                                      const hour12 = hours % 12 || 12;
                                      const ampm = hours >= 12 ? 'PM' : 'AM';
                                      updates.timePickerState = {
                                        hour: hour12.toString(),
                                        minute: minutes,
                                        ampm: ampm
                                      };
                                    } else if (!newUseDropdown && dayState.time) {
                                      // Switching to custom input, show formatted time
                                      updates.customTimeInput = formatTimeToAMPM(dayState.time);
                                    }
                                    
                                    updateDayState(itinerary.id, day, updates);
                                  }}
                                  className="text-gray-500 hover:text-forest-600 p-1"
                                  title={dayState.useDropdownTime ? "Switch to custom input" : "Switch to dropdown"}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Activity"
                                value={dayState.activity}
                                onChange={(e) => updateDayState(itinerary.id, day, { activity: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-32"
                              />
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  placeholder="Location"
                                  value={dayState.location}
                                  onChange={(e) => updateDayState(itinerary.id, day, { location: e.target.value })}
                                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                />
                                <button
                                  onClick={() => addActivity(itinerary.id, day)}
                                  className="bg-forest-600 text-white px-2 py-1 rounded hover:bg-forest-700"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Itineraries;