import React, { useState } from 'react';
import "../../statics/CSS/Create.css";
import axios from 'axios';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import { useNavigate } from 'react-router-dom';

function Create() {
  const [activeTab, setActiveTab] = useState('images');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate= useNavigate();
  const token = localStorage.getItem('access')
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]); 
    setImageUploaded(true);
  };

  const handleVideoUpload = () => {
    setVideoUploaded(true);
  };

  const handlePost = () => {
    const formData = new FormData();
   
    formData.append('description', description);
    formData.append('img', imageFile);
    console.log("before posting ...")
    const res = axios.post(`${BASE_URL}/post/create-post/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 201) { // Checking status code
        console.log("Post created successfully");
        navigate('/home');
      } else {
        console.log("Post creation failed");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  
    
    console.log("Posting...");
  };

  

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div className="container">
      <div className="tabs">
        <button onClick={() => handleTabClick('images')} className={`tabButton ${activeTab === 'images' ? 'active' : ''}`}>Images</button>
        <button onClick={() => handleTabClick('videos')} className={`tabButton ${activeTab === 'videos' ? 'active' : ''}`}>Videos</button>
      </div>
      <div id="imagesContent" className={`content ${activeTab === 'images' ? 'active' : ''}`}>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      </div>
      <div id="videosContent" className={`content ${activeTab === 'videos' ? 'active' : ''}`}>
        <input type="file" accept="video/*" multiple onChange={handleVideoUpload} />
      </div>
      {(imageUploaded || videoUploaded) && (
        <div>
         <textarea
  placeholder="Add description..."
  value={description}
  onChange={handleDescriptionChange}
  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-100"
/>

          <button onClick={handlePost}>Post</button>
        </div>
      )}
    </div>
  );
}

export default Create;
