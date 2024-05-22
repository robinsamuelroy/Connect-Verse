import { createSlice } from '@reduxjs/toolkit'

export const userBasicDetailsSlice = createSlice(

    {
        name : 'user_basic_details',
        initialState:{
            userProfile : {}
        },
        reducers:{
            set_user_basic_details : ( state , action ) => {
                console.log("inslice",action)
                state.userProfile = action.payload;
                
            },
           
    }
    }
);

export const { set_user_basic_details} = userBasicDetailsSlice.actions

export default userBasicDetailsSlice.reducer