import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../statics/api_urls/api_urls'
import axios from 'axios';

function EditProfile() {
  const token = localStorage.getItem('access')
  const [userDetails,setUserDetails] = useState(null)
  const [profilePic,setprofilePic] = useState('')
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange=(event)=>{
    const file = event.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
  }

  const fetchUserData = () => {
    axios.get(`${BASE_URL}/accounts/current-user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => { 
      if (res.status === 200) {
        console.log('userdetails',res.data);
        setUserDetails(res.data)
        setprofilePic(`${BASE_URL}/${res.data.display_pic}`)
        setPreviewImage(`${BASE_URL}/${res.data.display_pic}`)
        
      } else {
        console.error('Failed to fetch user data:', res.status, res.statusText);
      }
    })
    .catch(error => {
      console.error('An error occurred while fetching user data:', error);
    });
  }
  const handleSave= async (event)=>{
    console.log('inside handleSave')

    const formData = new FormData();
    
    formData.append("display_pic", event.target.display_pic.files[0]);
    formData.append("first_name", event.target.first_name.value)
    formData.append("last_name", event.target.last_name.value)
    axios.post(`${BASE_URL}/accounts/edit-user/`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

 
  useEffect(()=>{
      fetchUserData();
  },[])
  return (  
    <div class="bg-neutral-900 container mx-auto p-4 md:p-8">
    <div class="bg-neutral-900 shadow-md rounded-lg p-6 md:p-12">
      <h2 class="text-2xl font-bold mb-6 text-white">Edit Profile</h2>
      <form  onSubmit={handleSave} >
        <div class="flex items-center mb-6">
          <img id="display-pic-preview" src={previewImage} alt="Profile Picture" class="w-24 h-24 rounded-full object-cover mr-4"/>
          <div>
            <label class="block text-sm font-medium text-white">Profile Picture</label>
            <input type="file" id="display_pic" name="display_pic" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={handleFileChange}/>
          </div>
        </div>
        <div class="mb-4">
          <label for="first_name" class="block text-sm font-medium text-white" >First Name</label>
          <input type="text" id="first_name" name="first_name" class="mt-1 block w-full p-2 border  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={userDetails ? userDetails.first_name : ''} onChange={(e) => setUserDetails(prevState => ({ ...prevState, first_name: e.target.value }))} />
        </div>
        <div class="mb-4">
          <label for="last_name" class="block text-sm font-medium text-white">Last Name</label>
          <input type="text" id="last_name" name="last_name" class="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={userDetails ? userDetails.last_name: ''} onChange={(e) => setUserDetails(prevState => ({ ...prevState, last_name: e.target.value }))} />
        </div>
        <div>
          <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >Save</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default EditProfile