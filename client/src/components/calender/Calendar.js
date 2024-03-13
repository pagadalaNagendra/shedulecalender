import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Swal from "sweetalert2";
import "./ScheduleCalendar.css";
import Navbar from "../navbar/navbar";

function ScheduleCalendar() {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:2500/calendarschema");
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



  const triggeredAlerts = new Set(); 
  

  function isValidEmail(emails) {
    const emailsArray = emails.split(",")
    let result=false
    for (let i of emailsArray){
      result = i.includes("@")
      if(!result){
        break;
      }
    }
    return result
  }


  const currentDate = new Date();

  function getDayName(day) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  }

  function getMonthName(month) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month];
  }

  function padWithZeros(num, length) {
    return num.toString().padStart(length, '0');
  }

  
  async function handleDateSelect(selectInfo) {
    console.log(selectInfo.start);
    const eventDate = String(selectInfo.start).slice(0, 16);
  
    Swal.fire({
      title: "Enter event details",
      html:
        '<input id="title" class="swal2-input" placeholder="Event title">' +
        '<input id="emails" class="swal2-input" placeholder="Email">' +
        '<input id="eventTime" class="swal2-input" type="time" placeholder="Event time">',
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const title = document.getElementById("title").value;
        const emails = document.getElementById("emails").value;
        const eventTime = document.getElementById("eventTime").value;
  
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
        if (title && isValidEmail(emails)) {
          const end = new Date(selectInfo.endStr);
  
          end.setHours(eventTime.split(":")[0]);
          end.setMinutes(eventTime.split(":")[1]);
          const newEvent = {
            title,
            emails,
            start: eventDate,
            end,
            eventTime,
          };

          axios.post("http://localhost:2500/sendMail",newEvent)
          .then(response=>{
            console.log(response)
          })
          // console.log(sendMail)
          axios
            .post("http://localhost:2500/calendarschema", newEvent)
            .then((response) => {
              const updatedEvents = [...events, { ...newEvent, id: response.data._id }];
              setEvents(updatedEvents);
              window.location.reload()
              
            })
            .catch((error) => {
              console.error("Error adding event:", error);
            });
            
        } else {
          Swal.fire("Error", "Please enter a valid email and title", "error");
        }
      }
    });
  }
  
  
  function handleEventRemove(clickInfo) {
    Swal.fire({
      title: `Are you sure you want to delete the event '${clickInfo.event.title}'?`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:2500/calendarschema/${clickInfo.event.id}`).then(() => {
          const filteredEvents = events.filter((event) => event.id !== clickInfo.event.id);
          setEvents(filteredEvents);
        });
      }
    });
  }

  function handleEventUpdate(updateInfo, calendarApi) {
    const { event } = updateInfo;
    const updatedEvent = {
      ...event,
      start: updateInfo.start,
      end: updateInfo.end,
    };
    axios.put(`http://localhost:2500/calendarschema/${event.id}`, updatedEvent).then(() => {
      calendarApi.getApi().updateEvent(updatedEvent);
    });
  }

  return (
    <div>
      <Navbar/>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        editable={true}
        eventDurationEditable={true}
        eventResize={(updateInfo) => handleEventUpdate(updateInfo, calendarRef)}
        eventDrop={(updateInfo) => handleEventUpdate(updateInfo, calendarRef)}
        eventClick={handleEventRemove}
        events={events}
      />
    </div>
  );
}

export default ScheduleCalendar;
