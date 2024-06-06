import '../style/login.css'
import 'ldrs/quantum'
import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);


    let navigate = useNavigate(); 
    const routechange = () =>{ 
        let path = "/login"; 
        navigate(path);
    }

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, hashed_password: password }),
        };
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
            routechange();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 3) {
            submitRegistration();
        } else {
            setErrorMessage(
                "Ensure that the passwords match and greater than 5 characters"
            );
        }
    };

    return (
        <div className="login">
            <div className='login-page'>
                <div className='login-box'>
                    <div className='header'>Amrita Smart Waste Management</div>
                    <form onSubmit={handleSubmit}>
                        <div className='description'>Register</div>
                        <div className="login-field">
                            <div className="login-element">
                                <label className='input-labels'>User ID</label>
                                <input
                                    className='input-boxes'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                <label className='input-labels'>Reenter-Password</label>
                                <input
                                    className='input-boxes'
                                    type='password'
                                    name='password'
                                    value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)}
                                    placeholder=''
                                    required
                                />
                            </div>

                            <div className="submit-section">
                                <div className="submit-buttons" style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                    <input className='submit-button' type='submit' value='Submit' />
                                    <button className='return-button' onClick={() => window.location.href = '/login'}>Return to Login</button>
                                </div>
                            </div>
                            <ErrorMessage message={errorMessage} />
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


export default Register;
