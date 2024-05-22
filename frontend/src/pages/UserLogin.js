import React, { useEffect, useState } from 'react';
import '../statics/CSS/UserLogin.css';
import { BASE_URL } from '../statics/api_urls/api_urls';
import { set_authentication } from '../Components/redux/authentication/authentication';
import { Link ,useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import isAuthUser from '../utils/isAuthUser';






function UserLogin() {

  const [formError,setFormError] = useState([])
  const [message,setmessage] = useState(null)
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  useEffect(() => {
    if(localStorage.getItem("access")){
      navigate('/home')
    }
  } );


  const handleLoginSubmit = async(event)=>{
    event.preventDefault();
    
    
    const formData = new FormData();
    formData.append("email", event.target.email.value); // Correct name attribute
    formData.append("password", event.target.password.value);
    
    try {
      const res = await axios.post(BASE_URL+'/accounts/login/', formData);
      
      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        console.log("working access refres")
        
        // Assuming res.data contains isAdmin information
        dispatch(
          set_authentication({
            name: jwtDecode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin
          })
        );
        console.log("home")
        navigate('/home')
        return res
      } 
    } catch (error) {
      console.log(error);
      if(error.response.status === 401){
        setFormError(error.response.data)
      }
      else{
        console.log(error);
      }
    }
  }

  return (
    <>
    <div  style={{display:'flex', backgroundColor:'black'}}>
    <div className="social_connect" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',paddingLeft:'10%'   }}>
       <h2 style={{ fontSize: '60px', fontFamily: "BSofia, cursive",  }}>Social Connect</h2>

    </div>
    <div className="container" style={{paddingTop:'7.5%' }}>
            <form className="form" action="login" method="post" onSubmit={handleLoginSubmit}>
                <h2>Login</h2>
                <input type="text" name="email" placeholder="email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <Link to="/register"><a><h3> No Account </h3></a></Link>

      </div>
      </div>
      </>
  )
}

export default UserLogin;