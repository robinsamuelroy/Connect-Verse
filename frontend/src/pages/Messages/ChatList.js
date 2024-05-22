import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import {useNavigate } from 'react-router-dom';
import bg from '../../statics/images/profile.png'

function ChatList() {
const [users,setUsers] = useState([])
const [chatUser,setchatUser] = useState([])
const [unreadMessages, setUnreadMessages] = useState({});
const token = localStorage.getItem('access')
const navigate = useNavigate();


// const followFetch = async () => {
    
//           const res = await axios.get(`${BASE_URL}/post/followings/`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//                 if (res.status === 200){
//             console.log("message data",res.data)
//             setUsers(res.data)
//           }
          
//             }
const roomFetch = async () => {
  const res = await axios.get(`${BASE_URL}/chat/chatrooms/`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
    if (res.status === 200){
            console.log("chatroomdata",res.data)
            setUsers(res.data)
          }       

}

const onSelectUser = async (user) => {
        const res = await axios.post(`${BASE_URL}/chat/create-room/${user.id}/`,{
          other_user_id : user.id
        },{
          headers : {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 200 || res.status === 201) {
          const roomId = res.data.id;
          navigate(`/chat/${roomId}`, { state: { userId: user.id } });
      }
      setUnreadMessages((prev) => ({
        ...prev,
        [user.id]: false
      }));
}

useEffect(()=>{
    // followFetch()
    roomFetch()
},[])

useEffect(() => {
  const wsUrl = `ws://${window.location.hostname}:8000/ws/notifications/?token=${token}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setUnreadMessages((prev) => ({
      ...prev,
      [data.sender]: true
    }));
  };

  return () => {
    ws.close();
  };
}, [token]);


  return (
    <div class="mt-60">
    <div class="max-w-md mx-auto mt-8 p-4 bg-zinc-900 shadow-lg rounded-lg ">
    <h3 class="text-lg font-semibold text-white-800 mb-4">Select User to Chat With</h3>
    <ul class="space-y-2">
        {users.map(room => (
          room.members.map(user => 
            <li 
                key={user.id} 
                class="cursor-pointer p-2 bg-zinc-900rounded-lg hover:bg-zinc-500  active:bg-zinc-900 "
                onClick={() => onSelectUser(user)}
            >   
            <div className="flex items-center">
            {user.display_pic ? (
                                        <img className="small-circle-img" src={user.display_pic} alt="User Display Pic" />
                                    ) : (
                                        <img className="small-circle-img" src={bg} alt="Default Image" />
                                    )}
                <span className="ml-2">{user.first_name} {user.last_name}</span>
            </div>
            {unreadMessages[room.id] && (
                  <div className="bg-red-500 rounded-full w-3 h-3"></div>
                )}
            </li>
        )))}
    </ul>
</div>
</div>


  )
}

export default ChatList;