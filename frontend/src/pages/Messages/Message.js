import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BASE_URL } from '../../utils/constants';
import axios from 'axios';
import BG from '../../statics/images/bgchat.jpeg';

function Message() {
    const { roomId } = useParams();
    const [dp, setDp] = useState('');
    const [name, setName] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const location = useLocation();
    const { userId } = location.state || {};
    const token = localStorage.getItem('access');
    const websocketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${roomId}/?token=${token}`;
    const wsRef = useRef(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/accounts/specific-user-details/`, {
                params: { user_id: userId },
                headers: { Authorization: `Bearer ${token}` },
            });
            setDp(res.data.display_pic);
            setName(res.data.first_name);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/chat/chat-room/${roomId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        
        fetchUser();
        fetchMessages();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [roomId]);

    useEffect(() => {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
            fetchMessages();
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [wsUrl]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const messageData = {
                message: newMessage,
            };
            wsRef.current.send(JSON.stringify(messageData));
            setNewMessage('');
        }
    };

    return (
        <div className="bg-zinc-00 h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-cover shadow-lg rounded-lg" style={{ backgroundImage: `url(${BG})` }}>
                <div className="bg-zinc-900 text-white py-3 px-5 rounded-t-lg flex items-center">
                    <img className="small-circle-img" src={`${BASE_URL}${dp}`} alt="Profile Picture" />
                    <h1 className="text-xl font-bold p">{name}</h1>
                </div>
                <div className="p-4 h-96 overflow-y-scroll scroll-hidden flex flex-col-reverse">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === userId ? 'justify-start' : ''}`}>
                                 <div className={`bg-yellow-100 text-gray-800 p-3 rounded-lg max-w-xs ${msg.sender === userId ? '' : 'ml-auto'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-200 p-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className="ml-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Message;
