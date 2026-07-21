import React, { useState, useEffect } from 'react';
import { Reminder, Vital } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define components inside the same file to avoid unmounting issues
const EmergencyCard: React.FC = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
          setError(null);
        },
        () => {
          setError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-red-600 mb-4">Emergency & Quick Help</h2>
      <div className="space-y-3">
        <a href="tel:911" className="block w-full text-center bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
          Tap for Emergency Call (SOS)
        </a>
        <button onClick={handleGetLocation} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Share Live Location
        </button>
        {location && <p className="text-center text-green-600 font-medium mt-2">Location: {location}</p>}
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

const ReminderCard: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const storedReminders = localStorage.getItem('medicineReminders');
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  }, []);

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicine && time) {
      const newReminder = { id: Date.now(), medicine, dosage, time };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('medicineReminders', JSON.stringify(updatedReminders));
      setMedicine('');
      setDosage('');
      setTime('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Medicine Reminders</h2>
      <form onSubmit={addReminder} className="space-y-3 mb-4">
        <input type="text" value={medicine} onChange={e => setMedicine(e.target.value)} placeholder="Medicine Name" className="w-full p-2 border rounded-md" />
        <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Dosage (e.g., 1 tablet)" className="w-full p-2 border rounded-md" />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded-md" />
        <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">Add Reminder</button>
      </form>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {reminders.length > 0 ? reminders.map(r => (
          <li key={r.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span><strong>{r.medicine}</strong> {r.dosage && `(${r.dosage})`}</span>
            <span className="font-mono text-blue-600">{r.time}</span>
          </li>
        )) : <p className="text-gray-500 text-center">No reminders set for today.</p>}
      </ul>
    </div>
  );
};

const VitalsCard: React.FC = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [heartRate, setHeartRate] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');

  useEffect(() => {
    const storedVitals = localStorage.getItem('healthVitals');
    if (storedVitals) {
      setVitals(JSON.parse(storedVitals));
    }
  }, []);

  const addVital = (e: React.FormEvent) => {
    e.preventDefault();
    const newVital: Vital = {
      date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      bpSystolic: bpSystolic ? parseInt(bpSystolic) : undefined,
      bpDiastolic: bpDiastolic ? parseInt(bpDiastolic) : undefined,
    };
    const updatedVitals = [...vitals, newVital].slice(-30); // Keep last 30 entries
    setVitals(updatedVitals);
    localStorage.setItem('healthVitals', JSON.stringify(updatedVitals));
    setHeartRate('');
    setBpSystolic('');
    setBpDiastolic('');
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Real-Time Health Tracking</h2>
      <form onSubmit={addVital} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} placeholder="Heart Rate (bpm)" className="w-full p-2 border rounded-md" />
        <div className="flex gap-2">
            <input type="number" value={bpSystolic} onChange={e => setBpSystolic(e.target.value)} placeholder="BP Systolic" className="w-full p-2 border rounded-md" />
            <input type="number" value={bpDiastolic} onChange={e => setBpDiastolic(e.target.value)} placeholder="BP Diastolic" className="w-full p-2 border rounded-md" />
        </div>
        <button type="submit" className="md:col-span-2 w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">Track Vitals</button>
      </form>
       <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={vitals} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="heartRate" stroke="#8884d8" name="Heart Rate" />
            <Line type="monotone" dataKey="bpSystolic" stroke="#82ca9d" name="Systolic BP" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const HealthHub: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Health Hub</h1>
        <p className="text-gray-600 mb-6">Manage your health essentials all in one place.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <EmergencyCard />
                <ReminderCard />
            </div>
            <VitalsCard />
        </div>
    </div>
  );
};

export default HealthHub;
