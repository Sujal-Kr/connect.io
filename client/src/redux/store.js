import {configureStore} from '@reduxjs/toolkit'
import authSlice from './slices/auth'
import miscSlice from './slices/misc'
import chatSlice from './slices/chat'
const store=configureStore({
    reducer:{
        auth:authSlice,
        misc:miscSlice,
        chat:chatSlice,
    }
})

export default store