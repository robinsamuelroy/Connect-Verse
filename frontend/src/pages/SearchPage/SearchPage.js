import React,{useState} from 'react'
import { BASE_URL } from '../../statics/api_urls/api_urls';
import axios from 'axios';
import { Link } from 'react-router-dom';
import default_pro_pic from '../../statics/images/profile.png';

function SearchPage() {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const token = localStorage.getItem('access')

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            axios.get(`${BASE_URL}/accounts/search/?q=${value}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
            )
                .then(response => {
                    setResults(response.data);
                    console.log("search",response.data)
                })
                .catch(error => {
                    console.error("There was an error searching for users!", error);
                });
        } else {
            setResults([]);
        }
    };

  return (
    <div className="flex flex-col items-center mt-8">
            <input 
                type="text" 
                value={query} 
                onChange={handleInputChange} 
                placeholder="Search users..." 
                className="w-48 p-2 border text-white bg-zinc-600 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
                style={{maxWidth:'800px'}}
            />
            <ul className="w-48 bg-gray-900 shadow-lg rounded-lg overflow-hidden">
                {results.map(user => (
                    <li 
                    
                        key={user.id} 
                        className="p-4 border-b border-gray-900 last:border-0 hover:bg-gray-500 cursor-pointer"
                    >
                        <Link to={`/profile/${user.id}`}>
                        <div style={{display:"flex"}}>
                        
                        <img className="small-circle-img" src={user.pro_pic? `${BASE_URL}${user?.pro_pic}` : {default_pro_pic}} alt="Profile Picture"/>
                        <div className="p-2 ml-5">{user.username}</div>
                        </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
  )
}

export default SearchPage