import React, { useState, useEffect } from 'react';
import './TimezoneConverter.css';

const TimezoneConverter = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState('');
  const [timezoneList, setTimezoneList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetSearchTerm, setTargetSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Generate timezone list
  useEffect(() => {
    const timezones = Intl.supportedValuesOf('timeZone').map(tz => ({
      value: tz,
      label: tz.replace(/_/g, ' ')
    }));
    setTimezoneList(timezones);
  }, []);

  // Set default values on component mount
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setDate(`${year}-${month}-${day}`);
    setTime(`${hours}:${minutes}`);
  }, []);

  // Filter timezones based on search
  const filteredTimezones = timezoneList.filter(tz =>
    tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTargetTimezones = timezoneList.filter(tz =>
    tz.label.toLowerCase().includes(targetSearchTerm.toLowerCase()) ||
    tz.value.toLowerCase().includes(targetSearchTerm.toLowerCase())
  );

  // Convert time between timezones
  const convertTime = () => {
    try {
      setError('');
      
      if (!date || !time) {
        setError('Please select both date and time');
        return;
      }

      // Create date string in ISO format
      const dateTimeString = `${date}T${time}:00`;
      
      // Create date object (this will be in local timezone)
      const localDate = new Date(dateTimeString);
      
      // Validate the date
      if (isNaN(localDate.getTime())) {
        setError('Invalid date or time');
        return;
      }

      // Convert to source timezone
      const sourceDate = new Date(localDate.toLocaleString("en-US", {timeZone: sourceTimezone}));
      const targetDate = new Date(localDate.toLocaleString("en-US", {timeZone: targetTimezone}));
      
      // Calculate the offset and apply it
      const offset = targetDate.getTime() - sourceDate.getTime();
      const convertedDate = new Date(localDate.getTime() + offset);

      // Format the converted time
      const options = {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      const formattedTime = convertedDate.toLocaleString('en-US', options);
      setConvertedTime(formattedTime);

    } catch (err) {
      setError('Error converting time: ' + err.message);
    }
  };

  // Manual conversion - removed auto-convert functionality

  return (
    <div className="timezone-converter">
      <div className="converter-header">
        <h1>Timezone Converter</h1>
        <p>Convert time between different timezones around the world</p>
      </div>

      <div className="converter-form">
        <div className="form-section">
          <h3>Select Date & Time</h3>
          <div className="datetime-inputs">
            <div className="input-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Source Timezone</h3>
          <div className="timezone-selector">
            <input
              type="text"
              placeholder="Search timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={sourceTimezone}
              onChange={(e) => setSourceTimezone(e.target.value)}
              className="timezone-select"
            >
              {filteredTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Target Timezone</h3>
          <div className="timezone-selector">
            <input
              type="text"
              placeholder="Search timezone..."
              value={targetSearchTerm}
              onChange={(e) => setTargetSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={targetTimezone}
              onChange={(e) => setTargetTimezone(e.target.value)}
              className="timezone-select"
            >
              {filteredTargetTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="convert-button-section">
          <button 
            onClick={convertTime}
            className="convert-button"
            disabled={!date || !time}
          >
            Convert
          </button>
        </div>

        {convertedTime && (
          <div className="result-section">
            <h3>Converted Time</h3>
            <div className="converted-time">
              <div className="time-display">
                {convertedTime}
              </div>
              <div className="timezone-display">
                {targetTimezone.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneConverter;
