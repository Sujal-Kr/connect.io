import React from 'react'
import { Link } from 'react-router-dom'
import AvatarCard from './AvatarCard'
import { Avatar } from '@mui/material'
const ChatItem = ({
    avatar,
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessagesAlert,
    index = 0,
    handleDeleteChatOption
}) => {
    return (
        <Link to={`/chat/${_id}`} onContextMenu={handleDeleteChatOption} className={``} >
            <div className={`flex justify-start items-center p-3 relative   ${!sameSender&&"hover:bg-[#edf2f4]/40" } gap-4  `}>
                {/* <AvatarCard avatar={avatar} max={2}/> */}
                <Avatar src={avatar.url}/>
                <div className=''>
                    <h5 className='text-sm font-semibold'>{name}</h5>
                    {
                        newMessagesAlert &&
                        <div className='text-xs'>{newMessagesAlert.count} New Message </div>
                    }
                </div>
                {
                    isOnline && <div className='absolute h-2 w-2 bg-green-500 top-1/2 right-4 rounded-full -translate-y-1/2'>

                    </div>
                }
            </div>
        </Link>
    )
}

export default ChatItem