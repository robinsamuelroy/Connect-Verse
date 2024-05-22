import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import isAuthUser from '../utils/isAuthUser';

import axios from "axios";
import { BASE_URL } from "../statics/api_urls/api_urls";
import { useDispatch } from "react-redux";
import { set_user_basic_details } from "./redux/userBasicDetails/userBasicDetials";
import { set_profile_pic } from "./redux/userBasicDetails/userBasicDetials";


function PrivateRoute({ children }) {
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchData = async () => {
            const authInfo = await isAuthUser();
            setIsAuthenticated(authInfo.isAuthenticated);
            setLoading(false);
        };

        fetchData();
    },[]);


    useEffect(() => {
        const storeData = () => {
            axios.get(`${BASE_URL}/accounts/user-details/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                console.log(response.data)
                    const data = response.data;
                    localStorage.setItem('profile_id',response.data.id)
                    console.log("new_store",data)
                    dispatch(set_user_basic_details(data));
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                // Handle error gracefully, e.g., show error message to the user
            });
        };
    
        storeData();
    },[]);
    

    
    if (isLoading) {
        return <div> Loading....</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute;
