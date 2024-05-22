import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import { useNavigate ,useParams,useLocation} from 'react-router-dom';
import BG from '../../statics/images/bgchat.jpeg'
import getChatMessagesApi from '../../api/getChatMessagesApi';
import messageSeenApi from '../../api/messageSeenApi';
import contactListApi from '../../api/contactListApi';
import { useSelector } from 'react-redux';

function Chat() {
    const { roomId } = useParams();
    const [dp,setDp] = useState();
    const [name,setName] = useState();
    const location = useLocation();
    const { userId } = location.state || {};
    const token = localStorage.getItem('access')
    const [messages,setMessages] = useState([])
    const [inputMessage , setInputMessage] = useState('')
    const [ws,setWs] = useState(null)
    const [profiles, setProfiles] = useState([])
    const {user,isAuthenticated} =useSelector(state => state.user)

    const fetchUser = async()=>{
        try {
            const res = await axios.get(`${BASE_URL}/accounts/specific-user-details/?user_id=${userId}`, {
                params: { user_id: userId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("profile_id",res.data)
            setDp(res.data.display_pic)
            setName(res.data.first_name)
            console.log('dp',dp)
            
            // Handle response data
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
        }
    }


    const handleSendMessage = () => {
        if (ws && inputMessage.trim() !== "") {
          ws.send(JSON.stringify({ message: inputMessage }));
          setInputMessage("");
        }
      };
    
    

    const joinChatroom = async () => {
        try{
            const websocketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
            const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${roomId}/?token=${token}`;
            const newChatWs = new WebSocket(wsUrl);
            newChatWs.onopen = async () =>{
                const previousMessages = await getChatMessagesApi(roomId)
                setMessages(previousMessages);
                await messageSeenApi(userId);
                setProfiles((prevProfiles)=>{
                    return prevProfiles.map((profile) => {
                        if (profile.id === roomId){
                            return { ...profile, unseen_message_count:0 };
                        }
                        return profile;
                    });
                });
            };
            newChatWs.onerror = (event) =>{
                console.error('WebSocket error:', event);
            };

            newChatWs.onclose = (event) =>{
                if(event.wasClean){
                    console.log(`WebSocket connection closed cleanly, code:${event.code},reason:${event.reason}`);
                }else{
                    console.error(`WebSocket connection closed abruptly, code: ${event.code}, reason: ${event.reason}`);
                }
            };
            newChatWs.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message);
                // Handle incoming messages from the chatroom WebSocket
              };
    
            setWs(newChatWs);
        }
        
        catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchUser()
    },[])

    useEffect(()=>{
            if (ws){
                ws.onmessage = (event) => {
                    const message = JSON.parse(event.data)
                    setMessages((prevMessage) => [...prevMessage,message])
                }
            }
    },[ws])

    useEffect(()=>{
        const fetchData = async () => {
            try {
              const result = await contactListApi()
              setProfiles(result)
            } catch (error) {
              console.error(error)
            }
          }
          
          if (user) {
            fetchData()
          }
      
        },[user])
    

    

    return (
        <div class="bg-zinc-00 h-screen flex items-center justify-center">
        <div class="w-full max-w-md bg-cover shadow-lg rounded-lg" style={{ backgroundImage: `url(${BG})`}}>
        <div class="bg-zinc-900  text-white py-3 px-5 rounded-t-lg flex items-center">
        <img className="small-circle-img" src={`${BASE_URL}${dp}`} alt="Profile Picture"/>
            <h1 class="text-xl font-bold p">{name}</h1>
        </div>
        
      
        <div className="p-4 h-96 overflow-y-scroll scroll-hidden">
           
            <div class="space-y-4">
               
                <div class="flex">
                    <div class="bg-yellow-100  text-gray-800  p-3 rounded-lg max-w-xs">
                        <p>Hey there! How are you?</p>
                    </div>
                </div>
                
                <div class="flex justify-end ">
                    <div class="bg-yellow-100 text-gray-800 p-3 rounded-lg max-w-xs">
                        <p>I'm good, thanks! How about you?</p>
                    </div>
                </div>
                
            </div>
        </div>
        
    
        <div class="border-t border-gray-200 p-4 flex items-center ">
            <input type="text" placeholder="Type your message..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button class="ml-2 bg-blue-900  text-white px-4 py-2 rounded-lg hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500">Send</button>
        </div>
    </div>
</div>
    );
}

export default Chat;
