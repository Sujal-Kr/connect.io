import { AddOutlined,RemoveOutlined } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import React from 'react'

const UserItem = ({ user, handler, handlerIsLoading,isAdded=false }) => {
    const { avatar, name, _id } = user
    return (
        <div className='p-2 flex justify-start items-center gap-3 w-full  '>
            <Avatar src={avatar} />
            <p className='flex-1 line-clamp-1 w-full text-sm font-semibold '>{name||"Sujal Kumar"}</p>
            <button
                className='p-1  bg-white  rounded-lg text-xs  shadow-lg disabled:cursor-not-allowed'
                onClick={()=>handler(_id)}
                disabled={handlerIsLoading}>
                {!isAdded?<AddOutlined className='text-primary' />:<RemoveOutlined className='text-red-500' />}
            </button>
        </div>
    )
}

export default UserItem