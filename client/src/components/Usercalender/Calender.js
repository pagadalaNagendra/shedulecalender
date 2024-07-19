import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Swal from "sweetalert2";
// Import specific modules from firebase
// import firebase from 'firebase/app';


import "./Calender.css";

function ScheduleCalendar() {
  const [events, setEvents] = useState([]);
  const [count, setCount] = useState([0]);
  const calendarRef = useRef(null);



  function getFutureEvents(events) {
    const now = new Date();

    // Filter events that have a start time in the future
    const futureEvents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate > now;
    });

    // Sort the future events in ascending order based on the date and time difference
    const sortedFutureEvents = futureEvents.sort((eventA, eventB) => {
      const dateA = new Date(eventA.start);
      const dateB = new Date(eventB.start);

      // Compare dates first
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;

      // If dates are equal, compare time differences
      const timeDifferenceA = dateA.getTime() - now.getTime();
      const timeDifferenceB = dateB.getTime() - now.getTime();

      return timeDifferenceA - timeDifferenceB;
    });

    return sortedFutureEvents;
  }

  const haha = async () => {
    const eventTimesResponse = await axios.get("https://shedulecalender.onrender.com/eventtimes");
    const eventTimes = eventTimesResponse.data;
    console.log(eventTimes);
    const futureEvents = getFutureEvents(eventTimes);
    console.log(futureEvents);

    const now = new Date();
    const current_hours = now.getHours();
    const current_minutes = now.getMinutes();
    const current_seconds = now.getSeconds();
    const current_totalSeconds = current_hours * 3600 + current_minutes * 60 + current_seconds;
    const formattedDate = `${getDayName(now.getUTCDay())} ${getMonthName(now.getUTCMonth())} ${padWithZeros(now.getUTCDate(), 2)} ${now.getUTCFullYear()} ${padWithZeros(now.getUTCHours(), 2)}:${padWithZeros(now.getUTCMinutes(), 2)}:${padWithZeros(now.getUTCSeconds(), 2)} GMT+0530 (India Standard Time)`;
    const today = formattedDate.slice(0,16);
    console.log(count[0]);

    if(count[0] === 0) {
      console.log(count);
      const [hours, minutes] = futureEvents[0].alertTime.split(":").map(Number);
      const totalSeconds = hours * 3600 + minutes * 60;
      const timeDifference = totalSeconds - current_totalSeconds;
      const eventDate = futureEvents[0].start.slice(0,16);

      checkAlertTiming(futureEvents[0], timeDifference, `event will start at ${futureEvents[0].start}`);
      setCount([1]);
    }
  };

 

  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://shedulecalender.onrender.com/calendarschema");
        const calendarEvents = response.data.map((event) => {
          return {
            title: event.title,
            start: new Date(event.start),
            emails: event.emails,
            id: event._id,
          };
        });
        setEvents(calendarEvents);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  setInterval(() => checkUpcomingEvents(), 1000);

  const triggeredAlerts = new Set();

  async function checkUpcomingEvents() {
    try {
      const eventTimesResponse = await axios.get("https://shedulecalender.onrender.com/eventtimes");
      const eventTimes = eventTimesResponse.data;
      const now = new Date();
      const current_hours = now.getHours();
      const current_minutes = now.getMinutes();
      const current_seconds = now.getSeconds();
      const current_totalSeconds = current_hours * 3600 + current_minutes * 60 + current_seconds;
      const formattedDate = `${getDayName(now.getUTCDay())} ${getMonthName(now.getUTCMonth())} ${padWithZeros(now.getUTCDate(), 2)} ${now.getUTCFullYear()} ${padWithZeros(now.getUTCHours(), 2)}:${padWithZeros(now.getUTCMinutes(), 2)}:${padWithZeros(now.getUTCSeconds(), 2)} GMT+0530 (India Standard Time)`;
      const today = formattedDate.slice(0,16);

      eventTimes.forEach((event) => {
        const [hours, minutes] = event.alertTime.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60;
        const timeDifference = totalSeconds - current_totalSeconds;
        const eventDate = event.start.slice(0,16);

        if(timeDifference === 0 && eventDate === today){
          checkAlertTiming(event, timeDifference, "event started");
        } else if(timeDifference === 15 * 60 && eventDate === today){
          checkAlertTiming(event, timeDifference, "event will start in 15min");
        } else if(timeDifference === 30 * 60 && eventDate === today){
          checkAlertTiming(event, timeDifference, "event will start in 30min");
        } else if(timeDifference === 60 * 60 && eventDate === today){
          checkAlertTiming(event, timeDifference, "event will start in 60min");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function checkUpcomingEvents() {
    try {
      const eventTimesResponse = await axios.get("https://shedulecalender.onrender.com/eventtimes");
      const eventTimes = eventTimesResponse.data;
      const now = new Date();
      const current_hours = now.getHours();
      const current_minutes = now.getMinutes();
      const current_seconds = now.getSeconds();
      const current_totalSeconds = current_hours * 3600 + current_minutes * 60 + current_seconds;
      const formattedDate = `${getDayName(now.getUTCDay())} ${getMonthName(now.getUTCMonth())} ${padWithZeros(now.getUTCDate(), 2)} ${now.getUTCFullYear()} ${padWithZeros(now.getUTCHours(), 2)}:${padWithZeros(now.getUTCMinutes(), 2)}:${padWithZeros(now.getUTCSeconds(), 2)} GMT+0530 (India Standard Time)`;
      const today = formattedDate.slice(0, 16);
  
      eventTimes.forEach((event) => {
        const [hours, minutes] = event.alertTime.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60;
        const timeDifference = totalSeconds - current_totalSeconds;
        const eventDate = event.start.slice(0, 16);
  
        if (timeDifference === 0 && eventDate === today) {
          checkAlertTiming(event, timeDifference, "event started");
          // Call sendNotifications for immediate notifications
          sendNotifications(event);
        } else if (timeDifference === 15 * 60 && eventDate === today) {
          checkAlertTiming(event, timeDifference, "event will start in 15min");
          // Call sendNotifications for 15-minute notifications
          sendNotifications(event);
        } else if (timeDifference === 30 * 60 && eventDate === today) {
          checkAlertTiming(event, timeDifference, "event will start in 30min");
          // Call sendNotifications for 30-minute notifications
          sendNotifications(event);
        } else if (timeDifference === 60 * 60 && eventDate === today) {
          checkAlertTiming(event, timeDifference, "event will start in 60min");
          // Call sendNotifications for 60-minute notifications
          sendNotifications(event);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  

  async function checkAlertTiming(event, timeDifference, alertType) {
    const eventAlertType = {
      event,
      alertType,
    };

    if(!triggeredAlerts.has(eventAlertType)) {
      displayAlert(event, alertType);
      triggeredAlerts.add(eventAlertType);

      const mails = {
        emails: event.emails,
      };

      const sendMail = await axios.post("https://shedulecalender.onrender.com/sendMail", mails);
      console.log(sendMail);
    }
  }

  function displayAlert(event, alertType) {
    // Swal.fire({
    //   title: `Event Alert - ${event.title} ${alertType} at ${event.alertTime}`,
    //   text: `'${event.title}' ${alertType} `,
    //   icon: "info",
    //   confirmButtonText: "OK",
    // });
    addNotification({
      title : event.title,
      message: event.title,
      duration:4000,
      native:true
    })
  }

  function isValidEmail(emails) {
    const emailsArray = emails.split(",");
    let result = false;
    for(let i of emailsArray){
      result = i.includes("@");
      if(!result){
        break;
      }
    }
    return result;
  }

  const currentDate = new Date();

  function getDayName(day) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }

  function getMonthName(month) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[month];
  }

  function padWithZeros(num, length) {
    return num.toString().padStart(length, '0');
  }




  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        editable={true}
        eventDurationEditable={true}
        events={events}
      />
    </div>
  );
}

export default ScheduleCalendar;
