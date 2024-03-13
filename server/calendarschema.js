// const mongoose = require('mongoose');

// const eventSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   emails: {
//     type: [String], // Ensure it's an array of strings
//     required: true
//   },
//   start: {
//     type: Date,
//     required: true
//   },
//   end: {
//     type: Date,
//     required: true
//   },
//   alertTime: {
//     type: Number,
//     default: 0
//   }
// });

// // Add a virtual property for eventTime
// eventSchema.virtual("eventTime").get(function () {
//   // Extract the hours and minutes from the start date
//   const hours = this.start.getHours();
//   const minutes = this.start.getMinutes();

//   // Format the time as "HH:mm"
//   return `${hours}:${minutes}`;
// });

// const Event = mongoose.model('Event', eventSchema);

// module.exports = Event;




// const mongoose = require('mongoose');

// const eventSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   emails: {
//     type: [String], // Ensure it's an array of strings
//     required: true
//   },
//   start: {
//     type: String,
//     required: true
//   },
//   end: {
//     type: Date,
//     required: true
//   },
//     alertTime: {
//       type: String,
//       default: 0
//     }
// });

// const Event = mongoose.model('Event', eventSchema);

// module.exports = Event;


const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  emails: {
    type: [String], // Array of strings for email addresses
    required: true
  },
  start: {
    type: Date, // Changed to Date type for consistency
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  alertTime: {
    type: String,
    default: "0"
  },
  tokens: {
    type: Map, // A map to store tokens, key is the email and value is an array of tokens
    of: [String]
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;


















// ScheduleCalendar.js
// import React, { useState, useEffect, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import Swal from "sweetalert2";
// import "./ScheduleCalendar.css";

// function ScheduleCalendar() {
//   const [events, setEvents] = useState([]);
//   const calendarRef = useRef(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get("http://localhost:2500/calendarschema");
//         const calendarEvents = response.data.map((event) => {
//           return {
//             title: event.title,
//             start: new Date(event.start),
//             emails: event.emails,
//             id: event._id,
//           };
//         });
//         setEvents(calendarEvents);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Check for upcoming events and display alerts
//     checkUpcomingEvents();
//     // Set up interval to check every minute (adjust as needed)
//     const intervalId = setInterval(() => checkUpcomingEvents(), 60000);
//     return () => clearInterval(intervalId);
//   }, [events]);

//   function checkUpcomingEvents() {
//     const now = new Date();
//     events.forEach((event) => {
//       const startTime = new Date(event.start);
//       const timeDifference = startTime - now;

//       if (timeDifference > 0 && timeDifference <= 1800000) {
//         // Event starts within the next 30 minutes
//         displayAlert(event);
//       }
//     });
//   }

//   function displayAlert(event) {
//     Swal.fire({
//       title: `Event Alert`,
//       text: `Event '${event.title}' is starting soon at ${event.start}`,
//       icon: "info",
//       confirmButtonText: "OK",
//     });
//   }

//   function isValidEmail(emails) {
//     // Simple email validation using regular expression
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(emails);
//   }

//   function handleDateSelect(selectInfo) {
//     Swal.fire({
//       title: "Enter event details",
//       html:
//         '<input id="title" class="swal2-input" placeholder="Event title">' +
//         '<input id="emails" class="swal2-input" placeholder="Email">' +
//         '<input id="time" class="swal2-input" type="time" placeholder="Event time">',
//       showCancelButton: true,
//       confirmButtonText: "Create",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const title = document.getElementById("title").value;
//         const emails = document.getElementById("emails").value;
//         const time = document.getElementById("time").value;

//         let calendarApi = selectInfo.view.calendar;
//         calendarApi.unselect(); // clear date selection

//         if (title && isValidEmail(email)) {
//           const start = new Date(`${selectInfo.startStr}T${time}`);
//           const end = new Date(`${selectInfo.endStr}T${time}`);

//           const newEvent = {
//             title,
//             emails,
//             start,
//             end,
//           };

//           axios.post("http://localhost:2500/calendarschema", newEvent).then((response) => {
//             setEvents([...events, { ...newEvent, id: response.data._id }]);
//           });
//         } else {
//           // Handle case where title or email is empty or email is not valid
//           Swal.fire("Error", "Please enter a valid email and both title and email", "error");
//         }
//       }
//     });
//   }

//   function handleEventRemove(clickInfo) {
//     Swal.fire({
//       title: `Are you sure you want to delete the event '${clickInfo.event.title}'?`,
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, keep it",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios.delete(`http://localhost:2500/calendarschema/${clickInfo.event.id}`).then(() => {
//           const filteredEvents = events.filter((event) => event.id !== clickInfo.event.id);
//           setEvents(filteredEvents);
//         });
//       }
//     });
//   }

//   function handleEventUpdate(updateInfo, calendarApi) {
//     const { event } = updateInfo;
//     const updatedEvent = {
//       ...event,
//       start: updateInfo.start,
//       end: updateInfo.end,
//     };
//     axios.put(`http://localhost:2500/calendarschema/${event.id}`, updatedEvent).then(() => {
//       calendarApi.getApi().updateEvent(updatedEvent);
//     });
//   }

//   return (
//     <div>
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         selectable={true}
//         select={handleDateSelect}
//         headerToolbar={{
//           start: "today prev,next",
//           center: "title",
//           end: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         editable={true}
//         eventDurationEditable={true}
//         eventResize={(updateInfo) => handleEventUpdate(updateInfo, calendarRef)}
//         eventDrop={(updateInfo) => handleEventUpdate(updateInfo, calendarRef)}
//         eventClick={handleEventRemove}
//         events={events}
//       />
//     </div>
//   );
// }

// export default ScheduleCalendar;
