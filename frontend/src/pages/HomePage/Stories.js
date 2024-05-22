import React from 'react';
import '../../statics/CSS/Stories.css'; // Import your CSS file
import { BASE_URL } from '../../statics/api_urls/api_urls';
import axios from 'axios';



function Stories() {
  const token = localStorage.getItem('access')

  const fetchStories = async ()=>{
        const res = await axios.get(`${BASE_URL}/post/storyDetails/`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }
       )
  } 


  return (
    <div className="navbar rounded-2xl w-4/5 ml-10 bg-gray-900 flex items-center " style={{ borderRadius:'20px',width: '80%', marginLeft: '10%', backgroundColor: 'rgb(24, 24, 24)' }}>
    <div className="story" style={{  marginLeft:'5%'}}>Story</div>
    <div className="story" style={{  marginLeft:'5%'}}>Story</div>
    <div className="story" style={{  marginLeft:'5%'}}>Story</div>
    <div className="story" style={{  marginLeft:'5%'}}>Story</div>


    
    </div>
    


  );
}

export default Stories;
