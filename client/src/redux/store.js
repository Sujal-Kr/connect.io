import {configureStore} from '@reduxjs/toolkit'
import authSlice from './slices/auth'
import miscSlice from './slices/misc'
const store=configureStore({
    reducer:{
        auth:authSlice,
        misc:miscSlice,
    }
})

export default store