import React, { useEffect, useState } from 'react';
import '../../statics/CSS/Post.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import default_pro_pic from '../../statics/images/profile.png';

function Posts({setPostId}) {
    const token = localStorage.getItem('access')
    const[loading,setLoading]= useState(true);
    const [posts , setPosts] = useState([]);
    const navigate = useNavigate();
    const [liked,setLike] = useState(false)

    const fetchData = async () => {
        const res =   await axios.get(
            `${BASE_URL}/post/following-post/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("followers",res.data);
        setPosts(res.data)
        setLoading(false);
        };

    const handleLike = async (postId) =>{
        const response = await axios.post(`${BASE_URL}/post/like/${postId}/`,{},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
         if (response.status === 200 ){
          console.log("id's",response.data)
         }
            
        fetchData();
    }
    
   
    useEffect(()=>{        
        fetchData();
    },[]);

    
    

    return (
    <div>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <div className="post" style={{maxHeight: '925px', overflowY: 'auto'}}>
            {posts.map(post => (
            <div className="post-container" style={{ width: '60%',marginTop: '50px', marginLeft: '20%' ,height:'auto'}} >
                
                    <div key={post.id} className="post">
                        <Link to={`/profile/${post.author}`}>
                    <div  className="author-info" style={{ display: 'flex', marginBottom: '20px' }}>
                   
                                <img className="small-circle-img" src={post?.author_display_pic? `${BASE_URL}${post.author_display_pic}` : default_pro_pic} alt="Profile Picture"/>
                                <span style={{padding:"6px"}}>{post.author_first_name}</span>
                           
                                </div>
                                </Link>
                                <div className="post-content">
                                    <img src={`${BASE_URL}${post.img}`} alt="Post Image" style={{width:"100%"}} />
                                    <p className="mt-4 text-white">{post.description}</p>
                                </div>
                        <div className="post_buttons">
                        {/* {post.likes && post.likes.length > 0 ? (
                                <button className="love-button">
                                    <i className="fas fa-heart" style={{ color: liked ? 'red' : ' ' }}></i>
                                </button>
                         ) : (
                             <button className="love-button">
                                    <i className="fas fa-heart-broken" style={{ color: 'gray' }}></i>
                             </button>
                            )} */}

                        <button className="love-button" onClick={()=>handleLike(post.id)}>
                            <i className={`fas fa-heart${post.likes && post.likes.length ? '' : '-broken'}`} style={{ color: post.likes && post.likes.length ? 'red' : ' ' }} ></i>
                        </button>


                            <button className="comment-button" onClick={()=>setPostId(post.id)} ><i className="fas fa-comment"></i></button>
                            <button className="share-button"><i className="fas fa-share"></i></button>
                        </div>
                        <div className="comment-section hidden"></div>
                        <div className="share-popup hidden">
                            <div className="user-list"></div>
                            <button className="share-post-button">Share</button>
                            <button className="cancel-share-button">Cancel</button>
                        </div>
                    </div>
               
            </div>
        ))}
        </div>
        )}
    </div>
);
}

export default Posts;
