import React, { useState } from 'react';
import './feedback.css';
import { Link } from 'react-router-dom';

function Feedback() {
    const [feedback, setFeedback] = useState('');

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement feedback submission logic
        console.log(feedback);
        setFeedback('');
    };

    return (
        <div>
            <div style={{ position:'sticky',zIndex:99999, top:'0', maxWidth:'100%', height:'5rem', backgroundColor: 'rgba(92, 178, 128,1)', display: 'flex' , justifyContent:'flex-end' }}>
                <div style={{ display: 'flex', paddingRight:'3rem', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/analysis" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Analysis</Link>
                    </div>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/home" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Map</Link>
                    </div>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/feedback" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Feedback</Link>
                    </div>
                    <button onClick={() => {localStorage.removeItem('token'); window.location.href = '/';}} style={{ backgroundColor: 'rgba(159, 173, 210)', color: 'black', border: 'none', padding: '8px 10px', cursor: 'pointer', borderRadius: '10px', fontWeight: 'bold', fontFamily: 'Poppins' }}>Logout</button>
                </div>
            </div>
            <div class="contact-form">
                <form action="https://api.web3forms.com/submit" method="POST" class="form">

                    <input type="hidden" name="access_key" value="f9ae66a4-7cff-4fcb-bd8a-591587d9ac0d"/>
                    <input type="text" id="name" name="name" placeholder="Your Name" required/>
                    <input type="email" id="email" name="email" placeholder="Your Email" required/>
                    <textarea name="message" id="message" placeholder="Your Message" rows="10" required></textarea>
                    <div class="button-flex">
                        <button type="submit" class="submit-button">Send</button>
                        <button type="reset" class="reset-button">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Feedback;