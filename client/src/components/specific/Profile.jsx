import React from 'react'
import moment from 'moment/moment';

import {
    AlternateEmail as AlternateEmailIcon,
    Badge as BadgeIcon,
    CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { AtSign } from 'lucide-react';

const Profile = ({user}) => {
    
    const iconStyling={
        backgroundColor:"#4361ee",
        padding:"0.2rem",
        fontSize:"2rem",
        color:"white",
        borderRadius:"8px",
    }
    return (
        <div className='h-full '>
            <div className='flex flex-col  justify-center items-center border-b gap-4  mb-3 py-12'>
                <Avatar
                    src={user?.avatar?.url}
                    sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: "2px solid #fff"
                    }}>
                </Avatar>
                <div className='text-center '>
                    <h3>{user?.name}</h3>
                    <div className='flex my-1 gap-1 text-xs items-center justify-center text-darkgreen '><AtSign size={16} />{user?.username}</div>
                </div>
            </div>
            <div className=' flex flex-col justify-center  gap-3 '>
                <ProfileItem icon={<AlternateEmailIcon sx={iconStyling}/>} title={"Bio"} content={user?.bio}/>
                
                <ProfileItem icon={<CalendarMonthIcon sx={iconStyling}/>} title={"Joined"} content={moment(user?.createdAt).fromNow()}  />
                {/* <ProfileItem icon={}/> */}
            </div>
        </div>
    )
}

export default Profile


const ProfileItem = ({icon,title, content}) => {
    return (
        <div className='p-4 flex gap-1 items-center text-xs border-b'>
            {icon}
            <div>
                <h3 className='text-slate-800 font-medium'>{title}</h3>
                <h5 className=' text-slate-500 '>{content}</h5>
            </div>
        </div>
    )
}