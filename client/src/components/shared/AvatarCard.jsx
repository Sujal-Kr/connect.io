import React from 'react'
import { Avatar, AvatarGroup,Box } from '@mui/material'
import { transformImage } from '../../lib/Features'
const AvatarCard = ({avatar=[],max=2}) => {
  return (
    <div className=''>
        <AvatarGroup max={max}>
            <div className='relative'>
                {
                    avatar.map((item,index)=>(
                        <Avatar
                        key={index}
                        src={transformImage(item)}
                        alt={"avatar"+index}
                        sx={{
                            width:"3rem",
                            height:"3rem",
                            // position:"absolute",
                            left:{
                                xs:`${0.5+index}rem`,
                                sm:`${index}rem`
                            }
                        }}>

                        </Avatar>
                    ))
                }
            </div>
        </AvatarGroup>
    </div>
  )
}

export default AvatarCard