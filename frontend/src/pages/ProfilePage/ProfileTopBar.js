import React, { useEffect, useState } from 'react'
import '../../statics/CSS/ProfileTopBar.css'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../../statics/api_urls/api_urls'
import axios from 'axios';
import LeftBar from '../HomePage/LeftBar';
import { Link, useParams } from 'react-router-dom';
import default_pro_pic from '../../statics/images/profile.png';
import '../../statics/CSS/Chat.css'

function ProfileTopBar({isEditProfileOpen , setIsEditProfileOpen}) {
  const data= useSelector(state => state.user_basic_details.userProfile);
  const [user,setUser]=useState()
  const token = localStorage.getItem('access')
  const {id} = useParams();
  const [followButton,setFollowButton]=useState(true)
  const [unfollowButton,setUnFollowButton]=useState(false)
  const [followingIds, setFollowingIds] = useState([]);
  const [button,setButton]=useState(true);
  const [totalCounts,setotalCounts] = useState([]);
 
 
  const handleEditButton = () =>{
    console.log("state before ", isEditProfileOpen)
    setIsEditProfileOpen(true)
    console.log("state after ", isEditProfileOpen)

  }
  const handleUnFollow = async (id) =>{
    try{
      await axios.post(
        `${BASE_URL}/post/unfollow-user/${id}/`,{},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
      )
       // Refresh the user data after successful follow
       fetchData();
       followFetch();
       fetchTotalCount();

    }
    catch (error) {
      console.error("Error following user:", error);
  }
    
  }
  const handleFollow = async (id) => {
    try {
        await axios.post(
            `${BASE_URL}/post/follow-user/`,
            { following_id: id },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const res = await axios.post(`${BASE_URL}/chat/create-room/${user.id}/`,{
          other_user_id : user.id
        },{
          headers : {
            Authorization: `Bearer ${token}`
          }
        });
        // Refresh the user data after successful follow
        fetchData();
        followFetch();
        fetchTotalCount();
    } catch (error) {
        console.error("Error following user:", error);
    }
};

  const fetchCurrentUser = async () => {
    const res = await axios.get(`${BASE_URL}/accounts/current-user/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status === 200){
      if (res.data.id == id){
          setButton(false)

      }
    }
    

    // Add your logic to handle the response here
  };

  const followFetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/post/follow-details/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        console.log("Follow details", res.data);
        const newFollowingIds = res.data.following.map(follow => follow.following);
        setFollowingIds(newFollowingIds);
        console.log("Following ids", newFollowingIds);
        console.log("ID:", id, "Is Following:", newFollowingIds.includes(parseInt(id)));
        if (newFollowingIds.includes(parseInt(id))) {
          console.log("Inside if");
          setUnFollowButton(true);
          setFollowButton(false);
        }
        else {
          setUnFollowButton(false);
          setFollowButton(true);
        }
      }
    } catch (error) {
      console.error("Error fetching follow details:", error);
    }
  };
  


  const fetchData = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/accounts/specific-user-details/?user_id=${id}`, {
            params: { user_id: id },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("profile_id",res.data)
        setUser(res.data)
        // Handle response data
    } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
    }
};




  useEffect(()=>{
    fetchCurrentUser();
    fetchData() ;
    followFetch();
    fetchTotalCount();
    
  },[id])

  const fetchTotalCount = async () => {
    const res = await axios.get(`${BASE_URL}/post/total-counts/${id}/`,{
      headers: {
        Authorization: `Bearer ${token}`
    }
    })
    if (res.status  === 200){
      console.log("Counts",res.data)
      setotalCounts(res.data)
    }
    
    }


  
  return (
    <div className="profile" style={{ backgroundColor: "rgb(24, 24, 24)", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <div className="profile-header">
  <img className="profile-pic" src={user?.display_pic? `${BASE_URL}${user.display_pic}` : default_pro_pic} alt="Profile Picture" style={{ margin: 'auto' }} />
  </div>
  <h2 className="profile-name">{user?.first_name || "Loading..."}</h2>
  <div style={{ display: 'flex' }}>
  {button && (
  <>
    {followButton && (
      <button className="edit-button" onClick={() => handleFollow(user?.id)}>
        Follow
      </button>
    )}
    {unfollowButton && (
     <button
     className="edit-button"
     onClick={() => handleUnFollow(user?.id)}
     style={{ width: "200%", backgroundColor: "#333", color: "#fff" }}
   >
     Following
   </button>
  
    )}
  </>
)}
<Link   to=''  >
{!button &&
  <button className="edit-button" onClick = {handleEditButton} style={{width:"200%" ,marginLeft:'-40px'}}>Edit Profile</button>
}
</Link>
  </div>
  <div className="stats">
    <div className="stat">
      <div className="stat-value">{totalCounts.post_count}</div>
      <div className="stat-label">Posts</div>
    </div>
    <div className="stat">
      <div className="stat-value">{totalCounts.followers_count}</div>
      <div className="stat-label">Followers</div>
    </div>
    <div className="stat">
      <div className="stat-value">{totalCounts.following_count}</div>
      <div className="stat-label">Following</div>
    </div>
  </div>
</div>


  )
}

export default ProfileTopBar
