import React, { useState } from 'react'
import ProfileGrid from './ProfileGrid'
import LeftBar from '../HomePage/LeftBar'
import ProfileTopBar from './ProfileTopBar'
import '../../statics/CSS/Profilewrapper.css'
import { useParams } from 'react-router-dom'
import PostDetails from '../PostDetails/PostDetails';
import '../../statics/CSS/blur.css';
import EditProfile from './EditProfile';


function Profilewrapper({setPostId,postId}) {
  const { id } = useParams();
  const [isEditProfileOpen , setIsEditProfileOpen]  = useState(false);



  return (
    <>
    {postId && (
          <div className="flex justify-center items-center  " style ={{marginTop:"5vh"}}>
            <PostDetails setPostId={setPostId} postId={postId} />
          </div>
        )}
      <div className={`${postId?'doStyle':''}`}><ProfileTopBar isEditProfileOpen={isEditProfileOpen} setIsEditProfileOpen={setIsEditProfileOpen} id={id}/></div>
      
      <div className={`${postId?'doStyle':''}`}><ProfileGrid id={id} setPostId={setPostId} postId={postId} /></div>

      {isEditProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50  "   >
          <div className="bg-neutral-900 p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsEditProfileOpen(false)} // Close button to set isEditProfileOpen to false
              className=" top-2 right-2 bg-neutral-900 hover:text-gray-800 relative"
            >
              &times;
            </button>
            <EditProfile />
          </div>
        </div>
      )}
      
      </>
      
        
    
  );
}

export default Profilewrapper