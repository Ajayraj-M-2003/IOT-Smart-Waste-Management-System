import '../style/login.css'
import 'ldrs/quantum'
import React, { useState, useContext } from 'react'
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  let navigate = useNavigate(); 
  const [isLoading, setIsLoading] = useState(false);

  const dashboard = () =>{
    let path = "/home"
    navigate(path);
  }


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };
    setIsLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
      dashboard()
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };





    
  return (
    <div className="login" style={{ color: 'white', fontWeight: 'bold' }}>
      <div className='login-page'>
        <div className='login-box'>
          <div className='header'>Amrita Smart Waste Management</div>
          <form onSubmit={handleSubmit}>
            <div className='description'>Welcome Back!</div>
            <div className="login-field">
              <div className="login-element">
                <label className='input-labels'>User ID</label>
                <input
                  className='input-boxes'
                  type='email'
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  name='user_id'
                  placeholder='abcd@efgh.com'
                  required
                />
                
              <label className='input-labels'>Password</label>
              <input
                className='input-boxes'
                type='password'
                name='password'
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder=''
                required
              />
              </div>
              
              
              <input className='submit-button' type='submit' value='Submit' />
              <div className="register-link">
                <p>Not registered yet? <a href="/register" style={{ color: 'lightblue' }}>Register</a></p>
              </div>
              <ErrorMessage message = {errorMessage}></ErrorMessage>

            </div>
          </form>
        </div>
        {isLoading && (
                    <div className="loading-overlay">
                        <l-quantum size="80" color="white"/>
                    </div>
                )}
      </div>
    </div>
  );
};

  
  export default Login;