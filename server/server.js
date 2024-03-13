const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const Calender = require("./calendarschema");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const admin = require('firebase-admin');

mongoose.set("strictQuery", false);
const app = express();

var serviceAccount = require("C:/Users/NAGENDRA/Desktop/calenderfinalupdate22/server/rcts-cf4e0-firebase-adminsdk-6yzrl-d80982fbf5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


mongoose.connect("mongodb://127.0.0.1:27017/rcts", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");
});

app.use(express.json());
app.use(cors({ origin: "*" }));
app.post("/calendarschema", async (req, res) => {
  try {
    const { title, emails, start, end, alertTime, eventTime } = req.body;
    console.log(req.body)
    const emailsArray = typeof emails === 'string' ? emails.split(",") : emails;

    console.log("Parsed emailsArray:", emailsArray);

    const startTime = new Date(start);
    console.log(startTime)
    startTime.setHours(eventTime.split(":")[0]);
    startTime.setMinutes(eventTime.split(":")[1]);

    const endTime = new Date(end);
    endTime.setHours(eventTime.split(":")[0]);
    endTime.setMinutes(eventTime.split(":")[1]);
    console.log(eventTime)
    const newCalender = await Calender.create({
      title,
      emails: emailsArray,
      start: startTime,
      end: endTime,
      alertTime:eventTime, // Default to 0 if not provided
    });

    console.log("New Calendar Event:", newCalender);

    return res.status(201).json(newCalender);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/calendarschema", async (req, res) => {
  try {
    const calendarschema = await Calender.find();
    return res.status(200).json(calendarschema);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

app.get("/eventtimes", async (req, res) => {
  try {
    const calendarschema = await Calender.find({}, { alertTime: 1, title: 1,start:1,emails:1, _id: 0 }).sort({ start: 1 });
 
    return res.status(200).json(calendarschema);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});


app.get("/eventtimesofDay", async (req, res) => {
  const date = req.query.date;
  console.log(req.query.date);

  try {
    const escapedDate = date.replace(/[-////^$*+?.()|[/]{}]/g, '//$&');
    const calendarschema = await Calender.find(
      { start: { $regex: `^${escapedDate}`, $options: 'i' } },
      { alertTime: 1, title: 1, start: 1, emails: 1, _id: 0 }
    ).sort({ start: 1 });
    console.log(calendarschema);
    return res.status(200).json(calendarschema);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});
app.put("/calendarschema/:id", async (req, res) => {
  try {
    const { title, emails, start, end } = req.body;
    const existingCalender = await Calender.findByIdAndUpdate(
      req.params.id,
      { title, emails, start, end },
      { new: true }
    );
    if (!existingCalender) {
      return res.status(404).send("Events not found");
    }
    return res.status(200).json(existingCalender);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

app.delete("/calendarschema/:id", async (req, res) => {
  try {
    const existingCalender = await Calender.findByIdAndDelete(req.params.id);
    if (!existingCalender) {
      return res.status(404).send("Events not found");
    }
    return res.status(200).send("Events deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

app.post("/sendMail", async(req,res)=>{
  const {title,emails,start,eventTime} = req.body
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "durgabhavanigunnam0@gmail.com", 
      pass: "wdcz kebh ooaf hzxr",
    },
  });
  
    const mailOptions = {
      from: "durgabhavanigunnam0@gmail.com", 
      to: emails, 
      subject: `${title} EVENT ADDED TO THE CALENDER..`, 
      text: `Your ${title} event on ${start}, ${eventTime} is added to the calender. 
Thank You..!`, 
      
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  
    res.send("success") 
})

function sendPushNotification(title, body, tokens) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: tokens,
  };

  admin.messaging().sendMulticast(message)
    .then((response) => {
      const results = response.responses;

      results.forEach((result, index) => {
        if (!result.success) {
          const error = result.error;
          console.error(`Failed to send notification to ${tokens[index]}:`, error);
        }
      });

      console.log('Successfully sent messages:', results);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
}

setInterval(async () => {
  const now = new Date();
  const upcomingEvents = await Calender.find({ 
    start: { $gt: now }, 
    // Ensure you have an appropriate index for efficiency
  });

  upcomingEvents.forEach(event => {
    const eventTime = new Date(event.start).getTime();
    const currentTime = now.getTime();
    const timeUntilEvent = eventTime - currentTime;

    // Adjust this check as necessary for your use case
    if (timeUntilEvent <= 60000) { // 1 minute before event starts
      // Assuming event.emails is an array of tokens; adjust as necessary
      sendPushNotification(event.title, "Event is starting soon", event.emails);
    }
  });
}, 60000); // Check every minute


app.listen(2500, () => {
  console.log("Server is running....");
});












