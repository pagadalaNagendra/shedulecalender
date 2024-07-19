const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const Calender = require("./calendarschema");
const nodemailer = require("nodemailer");

mongoose.set("strictQuery", false);
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/Scb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");
});

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  return res.send("<h1>COORDINATOR DASHBOARD</h1>");
});



app.post("/calendarschema", async (req, res) => {
  try {
    const { title, emails, start, end, alertTime, eventTime } = req.body;
    console.log(req.body)

    // Convert emails to an array if it's a string
    const emailsArray = typeof emails === 'string' ? emails.split(",") : emails;

    console.log("Parsed emailsArray:", emailsArray);

    // Combine date and time into the start and end fields
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
      // eventTime,
      alertTime:eventTime, // Default to 0 if not provided
    });

    console.log("New Calendar Event:", newCalender);

    return res.status(201).json(newCalender);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});


// ... (rest of the code remains the same)



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
    // const calendarschema = await Calender.find().sort({ start: 1 });
    const calendarschema = await Calender.find({}, { alertTime: 1, title: 1,start:1,emails:1, _id: 0 }).sort({ start: 1 });
    // console.log(calendarschema)
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

app.post("/sendMail", async (req, res) => {
  const { title, emails, start, eventTime } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pagadalanagendra2003@gmail.com", // replace with your Gmail email
      pass: "sbqn aztv cezy vacl", // replace with your Gmail password
    },
  });

  const mailOptions = {
    from: "pagadalanagendra2003@gmail.com", // sender address
    to: emails, // list of receivers
    subject: `${title} EVENT ADDED TO THE CALENDER..`, // Subject line
    text: `Your ${title} event on ${start}, ${eventTime} is added to the calender. 
Thank You..!`, // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      return res.send("success");
    }
  });
});


app.listen(2500, () => {
  console.log("Server is running....");
});












