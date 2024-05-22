import React, { useEffect } from 'react';
import Posts from './Posts';
import Stories from './Stories';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import '../../statics/CSS/HomePage.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../statics/api_urls/api_urls'
import axios from 'axios';
import isAuthUser from '../../utils/isAuthUser'

import { useSelector } from 'react-redux'
import { useLocation} from 'react-router-dom';
import Create from '../Create/Create';
import '../../statics/CSS/blur.css'

function LayOut({children,postId}) {


  
  const location = useLocation();  
  const navigate = useNavigate();
  return (
    <div>
         <div className="home-page" >
         <div className={`${postId?'doStyle':''}`}> <LeftBar /> </div>
      <div className="main-content">
          
      
             
              {children}
           
          
      </div>
      <div className={`${postId?'doStyle':''}`}><RightBar /></div>
    </div>

    </div>
  )
}

export default LayOut