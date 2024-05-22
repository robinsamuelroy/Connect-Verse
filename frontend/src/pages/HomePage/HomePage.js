import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Stories from './Stories';
import Posts from './Posts';
import PostDetails from '../PostDetails/PostDetails';
import '../../statics/CSS/blur.css'

function HomePage({setPostId,postId}) {
 
  const location = useLocation();  
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="main-content">
        {/* Conditionally render Stories and Posts based on postId */}
        {/* <div className={`${postId?'doStyle':''}`}> <Stories />  </div>  */}
        {postId && (
          <div className="flex justify-center items-center z-50  ">
            <PostDetails setPostId={setPostId} postId={postId} />
          </div>
        )}
        <div className={`${postId?'doStyle':''}`}><Posts setPostId={setPostId} /></div>
       

       
      </div>
    </div>
  );
}

export default HomePage;
