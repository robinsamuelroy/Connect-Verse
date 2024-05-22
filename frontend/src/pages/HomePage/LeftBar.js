import React, { useEffect } from 'react'
import '../../statics/CSS/LeftBar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import bg from '../../statics/images/profile.png'

function LeftBar() {
    const token=localStorage.getItem('access')
    const data= useSelector(state => state.user_basic_details.userProfile);
    localStorage.getItem('user_id')
    const navigate = useNavigate()
    const handleProfile_id=()=>{
        axios.get(`${BASE_URL}/accounts/user-details/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
            console.log(response.data)
                const data = response.data;
                localStorage.setItem('profile_id',response.data.id)
                console.log("new_store",data)
                navigate('/profile');
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            // Handle error gracefully, e.g., show error message to the user
        });

       
    };

    
    return (
        <div className="post-container">
        <div className="post-buttons">
            <Link to='/home' className="link-no-underline">
                <button className="vertical-button">
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </button>
            </Link>
            <Link to='/search' className="link-no-underline">
                <button className="vertical-button">
                    <i className="fas fa-search"></i>
                    <span>Search</span>
                </button>
            </Link>
            <Link to='/messages' className="link-no-underline">
                <button className="vertical-button">
                    <i className="fas fa-envelope"></i>
                    <span>Message</span>
                </button>
            </Link>
            <button className="vertical-button">
                <i className="fas fa-bell"></i>
                <span>Notification</span>
            </button>
            <Link to='/create' className="link-no-underline">
                <button className="vertical-button">
                    <i className="fas fa-plus"></i>
                    <span>Create</span>
                </button>
            </Link>

            <Link to={`/profile/${data.id}`} className="link-no-underline">
                <button className="vertical-button">
                    <img className="small-circle-img mr-3" src={data.profile_pic ? data.profile_pic : bg} alt="Profile Picture" />
                    <span>{data.first_name}</span>
                </button>
            </Link>
        </div>
    </div>
      )
    }

    export default LeftBar