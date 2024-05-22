import React, { useEffect, useState } from 'react'
import '../../statics/CSS/ProfileGrid.css'
import { BASE_URL } from '../../statics/api_urls/api_urls'
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProfileGrid({setPostId,postId}) {
  const token = localStorage.getItem('access')
  const [images,setImages] = useState([]);
  const {id} = useParams()
  

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/post/get-post-profile/?user_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Handle the response data here
        setImages(response.data)
        console.log("post profile", response.data);
      } catch (error) {
        // Handle any errors
        console.error('Error fetching user posts:', error);
      }
    };
  
    fetchData();
  }, [id]);

  


  return (
    <div className="gallery overflow-auto mt-2 " style={{maxHeight: '500px', overflowYflex : 'auto'}} >

   
      <div className="ms-[7%] grid grid-cols-[30%,30%,30%] gap-2 grid-flow-row"  >
        
          {images.map((image, index) => (
            <div className=' h-[300px]   bg-cover' style={{backgroundImage:`url(${BASE_URL}${image.img})`}} onClick={()=>setPostId(image.id)}>
            
            
             </div>
          ))}
       
      </div>
      
    </div>


  
  );
}

export default ProfileGrid

{/* <img
              className='border-2 border-white h-[70%]' 
              key={index}
              src={`${BASE_URL}${image.img}`}
              alt={`Image ${index + 1}`}
              style={{  objectFit: 'cover', padding: '1%' }}
            /> */}