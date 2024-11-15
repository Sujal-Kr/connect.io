import React from 'react'
import {  CameraAlt } from '@mui/icons-material'
const ProfileInput = ({setProfile}) => {
    
  return (
   <label htmlFor='avatar'>
    <CameraAlt sx={{
        bgcolor:"rgb(0,0,0,0.5)",
        borderRadius:"100%",
        padding:"0.3rem",
        position:"absolute",
        bottom:0,
        color:"white",
        right:0,
        ":hover":{
            bgcolor:"rgb(0,0,0,0.7)",
            cursor:"pointer",
        }

    }}/>
    <input type="file" hidden name="avatar" id="avatar" onChange={(e)=>setProfile(e.target.files[0])} />
   </label>
  )
}

export default ProfileInput