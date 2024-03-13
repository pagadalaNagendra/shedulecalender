import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'
const Login = (props) => {
  const navigate= useNavigate()

  const [loginType, setLoginType] = useState('USER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleToggle = () => {
    setLoginType((prevLoginType) => (prevLoginType === 'USER' ? 'ADMIN' : 'USER'));
  };

  const handleLogin = () => {
    console.log(`Logging in as ${loginType} with username: ${username} and password: ${password}`);
    console.log(props)
    if (loginType === 'USER') {
      if(username==="pagadalanagendra2003@gmail.com" && password==="1111"){

        navigate('/Calender');
      }
      else{
        alert("Invalid credentials")
      }
    } else if (loginType === 'ADMIN') {
      if(username==="pagadalanagendra2003@gmail.com" && password==="0000"){

        navigate('/Calendar');
      }
      else{
        alert("Invalid credentials")
 
      }
    }
  };

  return (
    <div className='loginform'>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input defaultValue={"pagadalanagendra2003@gmail.com"} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Login Type: {loginType}
          <button type="button" onClick={handleToggle}>
            Toggle
          </button>
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;