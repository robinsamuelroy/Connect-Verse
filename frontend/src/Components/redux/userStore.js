import { configureStore } from '@reduxjs/toolkit'
import authenticationSliceReducer from './authentication/authentication'
import userBasicDetailsSliceReducer from './userBasicDetails/userBasicDetials'

export default configureStore({
    reducer:{
        authentication_user : authenticationSliceReducer,
        user_basic_details : userBasicDetailsSliceReducer

    }
})
