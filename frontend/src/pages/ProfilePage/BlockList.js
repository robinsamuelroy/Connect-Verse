import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/constants';
import axios from 'axios';
import bg from '../../statics/images/profile.png'

function BlockList({block,setBlock}) {
    const token=localStorage.getItem('access')
    const [users,setUsers] = useState([])
    const fetchBlocked=()=>{
        const res= axios.get(`${BASE_URL}/accounts/blocked-users/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((res)=>{
            console.log('blocked user',res.data)
            setUsers(res.data)
          }
          )
          .catch((error) => {
            console.error('Error fetching blocked users:', error);
          });
    }

    const handleBlock = async (id) => {
      try {
        const res = await axios.post(`${BASE_URL}/accounts/block-user/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        if (res.status === 200) {
          console.log('unblocked');
          alert('Unblocked successfully');
          fetchBlocked()
        }
    
        if (res.status === 201) {
          console.log('blocked');
          alert('User blocked successfully');
        }
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    }

    useEffect(()=>{ 
        fetchBlocked()
    },[])

    
  return (
  //   <div>
  //   <div className="grid grid-cols-1 h md:grid-cols-2 lg:grid-cols-3 gap-4">
  //   {users.map(user => (
  //     <div key={user.id} className="p-4 bg-grey-900 rounded-lg shadow-md    ">
  //       <img src={`${BASE_URL}${user.display_pic}`} alt={user.first_name} className="w-20 h-20 mx-auto mb-4 rounded-full" />
  //       <h2 className="text-lg font-semibold p-6">{user.first_name}</h2>
  //       <p className="text-gray-500">{user.bio}</p>
  //       <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">unblock</button> 
        
        

  //     </div>
  //   ))}
  //   <button onClick={() => setBlock(false)}><i className="fa fa-times" aria-hidden="true"></i></button>
  // </div>
  // </div>

<div className="">
  <button onClick={() => setBlock(false)}>
    <i className="fa fa-times" aria-hidden="true"></i>
  </button>
  {block && (
    <div className="max-w-md mx-auto mt-8 p-4 bg-zinc-900 shadow-lg rounded-lg">
      <ul className="space-y-2">
        {users.length > 0 ? (
          users.map(user => (
            <li
              key={user.id}
              className="cursor-pointer p-2 bg-zinc-900 rounded-lg hover:bg-zinc-500 active:bg-zinc-900"
            >
              <div className="flex items-center">
                {user.display_pic ? (
                  <img
                    className="small-circle-img"
                    src={`${BASE_URL}${user.display_pic}`}
                    alt="User Display Pic"
                  />
                ) : (
                  <img className="small-circle-img" src={bg} alt="Default Image" />
                )}
                <span className="ml-2">{user.first_name}</span>
                
                <button className="edit-button" onClick={()=>handleBlock(user.user_id)} style={{ width: "100%" }}>unblock</button>
              
              </div>
              
            </li>
          ))
        ) : (
          <p className="text-gray-500">No users to display</p>
        )}
        
      </ul>
    </div>
  )}
</div>


  )
}

export default BlockList