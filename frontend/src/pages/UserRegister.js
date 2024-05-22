import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../statics/api_urls/api_urls';

function UserRegister() {
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOTP] = useState('');
    const [formError, setFormError] = useState([]);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("access")){
          navigate('/home')
        }
      } );

    const verifyOTP = async (event) => {
        event.preventDefault();
        const otpValue = event.target.otp.value;
        const emailValue = email;
        console.log("verifyotp")

        try {
            const response = await axios.post(BASE_URL + '/accounts/otp_verify/', {
                OTP: otpValue,
                email: emailValue
            });

            if (response.status === 201) {
                
                navigate('/login', {
                    state: response.data.Message
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const userRegistration = async (event) => {
        event.preventDefault();
        setFormError([]);

        const formData = new FormData();
        formData.append('username', event.target.username.value);
        formData.append('first_name', event.target.first_name.value);
        formData.append('last_name', event.target.last_name.value);
        formData.append('email', event.target.email.value);
        formData.append('password', event.target.password.value);
        formData.append('confirm_password', event.target.confirm_password.value);
        setEmail(event.target.email.value);

        try {
            const response = await axios.post(BASE_URL + '/accounts/register/', formData);
            console.log("outside if ")
            
            
            if (response.status === 200) {
                console.log("inside if ")
                setShowOTPModal(true);
                console.log(showOTPModal)
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 406) {
                setFormError(error.response.data);
            } else {
                console.log(error);
            }
        }
    };

    return (
        <>
            <div  style={{display:'flex', backgroundColor:'black'}}>
    <div className="social_connect" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',paddingLeft:'10%'   }}>
    <h2 style={{ fontSize: '60px', fontFamily: "BSofia, cursive",  }}>Social Connect</h2>
            </div>

            {!showOTPModal && (<div className="container">
                <form className="form" onSubmit={userRegistration}>
                    <h2>Register</h2>
                    <input type="text" name="username" placeholder="Username" required />
                    <input type="text" name="first_name" placeholder="First Name" required />
                    <input type="text" name="last_name" placeholder="Last Name" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <input type="password" name="confirm_password" placeholder="Confirm Password" required />
                    <button type="submit">Register</button>
                </form>
                <Link to="/login"><a><h3> Already have an account </h3></a></Link>
            </div>)}

            {showOTPModal && (
                <div className="otp-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                    <div className="modal-content">
                        <h2>Enter OTP</h2>
                        <form onSubmit={verifyOTP}>
                        <input name="otp" type="number" placeholder="Enter OTP" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px', width: '100%', boxSizing: 'border-box' }} pattern="[0-9]*" inputMode="numeric" required />
                        <button type="submit">Submit OTP</button>
                        </form>
                    </div>
                </div> 
                
            )}
            </div>
        </>
    );
}

export default UserRegister;
