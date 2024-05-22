import React, { useEffect, useState } from 'react';
import '../../statics/CSS/RightBar.css';
import { Link, useNavigate } from 'react-router-dom';
import isAuthUser from '../../utils/isAuthUser';
import axios from 'axios';
import { BASE_URL } from '../../statics/api_urls/api_urls';
import default_pro_pic from '../../statics/images/profile.png';

function RightBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access');
    const [profile, setProfile] = useState([]);
    const [followingIds, setFollowingIds] = useState([]);
    const refreshToken = localStorage.getItem('refresh');


    const logout = async () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

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
            // Refresh the user data after successful follow
            fetchData();
            followFetch();
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    useEffect(() => {
        fetchData();
        followFetch();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/accounts/all-user-details/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                console.log("rightbar", res.data);
                setProfile(res.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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
            }
        } catch (error) {
            console.error("Error fetching follow details:", error);
        }
    };
    

    return (
        <div className="user-profiles" style={{ marginTop: '1%', height: '50%', borderRadius: '20px' }}>
            <button onClick={logout} style={{ width: '240px' }}>Logout</button>
            <div className="user-profile" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {profile.map((pro, index) => (
                    !followingIds.includes(pro.id) &&
                    <Link to={`/profile/${pro.id}`}>
                    <div key={index} className="user-info">
                        <img src={pro?.display_pic? `${BASE_URL}${pro.display_pic}` : default_pro_pic} alt="Profile Picture" />
                        <h3>{pro.first_name}</h3>
                        <button className="follow-button" onClick={() => handleFollow(pro.id)}>Follow</button>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default RightBar;
