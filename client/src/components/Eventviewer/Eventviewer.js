// EventViewer.jsx

import React, { useState } from 'react';
import "./Eventviewer.css";

const EventViewer = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);

  function formatDate(inputDate) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
  
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1], 10) - 1];
    const day = dateParts[2];
  
    const formattedDate = new Date(inputDate);
    const dayOfWeek = days[formattedDate.getUTCDay()];
  
    return `${dayOfWeek} ${month} ${day} ${year}`;
  }
  const getEvents = async () => {
    try {
      const theDate = formatDate(selectedDate)
      const response = await fetch(`http://localhost:2500/eventtimesofDay?date=${theDate}`);
      if (response.ok) {
        try {
          const eventsData = await response.json();
          setEvents(eventsData);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
        }
      } else {
        const errorText = await response.text();
        console.error(`Error fetching events: ${errorText}`);
      }
    } catch (networkError) {
      console.error('Network error:', networkError);
    }
  };
  
  
  

  return (
    <div className='eventviewer'>
      <h1>Events for Date</h1>
      <label htmlFor="dateInput">Select Date: </label>
      <input
        type="date"
        id="dateInput"
        value={selectedDate}
        onChange={(e) => {
          console.log(e.target.value)
          setSelectedDate(e.target.value)}}
      />
      <button onClick={getEvents}>Get Events</button>

      <div>
        {events.length === 0 ? (
          <p>No events for this date</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                Title: {event.title}, Start Time: {new Date(event.start).toLocaleTimeString()}, Alert Time: {event.alertTime}, Emails: {event.emails.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventViewer;
