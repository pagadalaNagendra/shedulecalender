
import "./App.css";
import { BrowserRouter, Route , Routes } from 'react-router-dom';
import Login from "./components/Login/login"; 
import Calendar from "./components/calender/Calendar";
import EventViewer from './components/Eventviewer/Eventviewer';
import Calender from "./components/Usercalender/Calender";
import Notification from './components/Notification/Notification';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" exact element={<Login/>}></Route> 
    <Route path="/Calendar" exact element={<Calendar/>}></Route>
    <Route path="/EventViewer" exact element={<EventViewer />}></Route>
    <Route path="/Calender" exact element={<Calender />}></Route>
    <Route path="/Notification" exact element={<Notification/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );  
  }
export default App;