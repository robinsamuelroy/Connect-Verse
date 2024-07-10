import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import axios from 'axios';
import '../../statics/CSS/postDetails.css'
function PostDetails({setPostId,postId}) {

    const token=localStorage.getItem('access')
    const [data,setData] = useState(null)
    const [liked,setLike] = useState(false)
    const [comment, setComment] = useState('');
    const [currentUserLiked , setcurrentUserLiked]=useState(false)


    const handleLike = async()=>{
      const response = await axios.post(`${BASE_URL}/post/like/${postId}/`,{},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
     if (response.status === 200 ){
      console.log("id's",response.data)
     }
     fetchLikeDetail()
     fetchPostDetails()
    }
    const handleComment = async () => {
      try {
        
          const res = await axios.post(`${BASE_URL}/post/comment/${postId}/`, 
              { body: comment },
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              }
              
          );
          setComment('');
          console.log(res.data);
      } catch (error) {
          console.error(error);
      }
      fetchPostDetails()
  };
  
   const fetchLikeDetail=async ()=>{
      const response = await axios.get(`${BASE_URL}/post/like-details/${postId}/`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    
      );
        if (response.status === 200){
            setLike(response.data.liked)
            console.log("liked or not",response.data.liked)
        }
   }

   const fetchPostDetails = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/post/post-details/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            console.log("postsdata", res.data);
            setData(res.data);
        } else {
            console.error("Failed to fetch post details", res);
        }
    } catch (error) {
        console.error("An error occurred while fetching post details", error);
    }
};



    const handleClose=()=>{
      setPostId(null)
    }
   
    useEffect(()=>{
        fetchPostDetails()
        fetchLikeDetail()
    },[postId])


  return (

    <div className="flex flex-col md:flex-row mx-auto md:mx-20 mt-16">
    <div className="md:w-3/4 mx-auto md:mx-0 mb-6 md:mb-0">
      <div className="bg-stone-950 rounded-xl">
        <div className="flex flex-row p-3">
          <img className="w-10 h-10 rounded-full" src={`${BASE_URL}${data?.author.display_pic}`} alt="pro_pic"/>
          <h3 className="ml-2 m-2">{data?.author.first_name}</h3>
          
        </div>
        <div className="pic" style={{ maxHeight: "70vh", overflow: "auto" }}>
          <img src={`${BASE_URL}${data?.img}`} alt="post_img" style={{ maxWidth: "100%", height: "auto" }}/>
        </div>
        <div className="flex justify-between items-center p-3">
          <div className="post_buttons">
          <button className="love-button" onClick={handleLike}  >
      <i className={`fas fa-heart${liked ? '' : '-broken'}`} style={{ color: liked ? 'red' : ' ' }} ></i>
    </button>
            <button className="comment-button"><i className="fas fa-comment"></i></button>
            <button className="share-button"><i className="fas fa-share"></i></button>
          </div>
          
        </div>
      </div>
    </div>
    <div className="md:w-1/4 mx-auto md:mx-0">
      <div className="bg-stone-950 rounded-xl p-4">
        <div className='flex flex-row'>
        <h3 className="ml-2 m-2">Comments</h3>
        <button onClick={handleClose} className="bg-transparent mx-28" style={{maxWidth:"20px" ,maxHeight:"50px"}}> <i class="fa fa-close"></i></button>
        </div>
        <div className="flex flex-col p-4">
          <label className="mb-2 font-bold text-lg text-white" htmlFor="comment">Leave a Comment:</label>
          <textarea rows="4" className="mb-4 px-3 py-2 rounded-lg text-gray-900" id="comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
          <div className="flex justify-end">
            <button className="bg-teal-800 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded max-w-[100px]" onClick={handleComment}>Comment</button>
          </div>  
          
          {data && data.comments && data.comments.map((comment) => (
                            <div key={comment.id} className="comment flex items-start mt-4">
                                <img
                                    className="w-8 h-8 rounded-full mr-3"
                                    src={`${BASE_URL}${comment.user.display_pic}`}
                                    alt={`${comment.user.username}'s profile`}
                                />
                                <div>
                                    <p className="text-white"><strong>{comment.user.username}</strong>: {comment.body}</p>
                                    <p className="text-gray-500 text-sm"><small>{new Date(comment.created_at).toLocaleString()}</small></p>
                                </div>
                            </div>
                        ))}

        </div>
      </div>
    </div>
  </div>
    
  );
}

export default PostDetails