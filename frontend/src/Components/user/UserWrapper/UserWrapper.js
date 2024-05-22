import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserLogin from '../../../pages/UserLogin';
import UserRegister from '../../../pages/UserRegister';
import { BrowserRouter as Router, Route, Routes, Navigate, useRoutes, Outlet } from 'react-router-dom';
import HomePage from '../../../pages/HomePage/HomePage';
import Profilewrapper from '../../../pages/ProfilePage/Profilewrapper';
import PrivateRoute from '../../PrivateRoute'
import isAuthUser from '../../../utils/isAuthUser';
import { useSelector,useDispatch } from 'react-redux';
import { BASE_URL } from '../../../statics/api_urls/api_urls';
import { set_authentication } from '../../redux/authentication/authentication';
import { set_user_basic_details } from '../../redux/userBasicDetails/userBasicDetials';
import { useNavigate } from 'react-router-dom';
import SearchPage from '../../../pages/SearchPage/SearchPage';
import Create from '../../../pages/Create/Create';
import Posts from '../../../pages/HomePage/Posts';
import Stories from '../../../pages/HomePage/Stories';
import LayOut from '../../../pages/HomePage/LayOut';
import PostDetails from '../../../pages/PostDetails/PostDetails';

import '../../../statics/CSS/blur.css'
import ChatList from '../../../pages/Messages/ChatList';
import Chat from '../../../pages/Messages/Chat';
import Message from '../../../pages/Messages/Message';


function UserWrapper() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Connected to Redux store
  const authentication_user = useSelector(state => state.authentication_user); // Connected to Redux store
  const [postId, setPostId] = useState(null);
  const checkAuth = async () =>{
    const isAuthenticated = await isAuthUser();
    dispatch(
      set_authentication({
        name: isAuthenticated.name,
        isAuthenticated : isAuthenticated.isAuthenticated
      })
    );

  };

  const token = localStorage.getItem('access');
  console.log(token)
  

  useEffect (()=>{
    if(!authentication_user.name){
      checkAuth();
    }
    // if(!authentication_user.isAuthenticated){
    //   userDetailsApi();
    // }
  },[authentication_user])

  const  routes = useRoutes([
    {
      element:(
        <PrivateRoute >
          {/* <div className={`${postId?'doStyle':''}`}> */}
          <LayOut postId={postId} >
            <Outlet/>
          </LayOut>
          {/* </div> */}
        </PrivateRoute>
        
      ),
      children : [
        {element:<HomePage setPostId={setPostId} postId={postId}/>,path:"/home"},
        {element: <Profilewrapper setPostId={setPostId} postId={postId} />, path: "/profile/:id" },
        {element:<Create/>  ,path : "/create"},
        {element:<SearchPage/>  ,path : "/search"},
        {element:<ChatList/>  ,path : "/messages"},
        {element:<Message/>  ,path : "/chat/:roomId"},       

      ]
    },
    {
      element:(
        <Outlet/>
      ),
      children : [
        { element: <UserLogin/>, path: "/login" },
        { element: <UserRegister/>, path: "/register" }
      ]
    }
  ])


  return (
    routes
  );
}

export default UserWrapper;