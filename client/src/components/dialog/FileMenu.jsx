import React from 'react'
import {Menu } from '@mui/material'

const FileMenu = ({anchor}) => {
  return (
    <Menu open={false} anchorEl={anchor} >
        <div className='w-12'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, veritatis.</div>
    </Menu> 
  )
}

export default FileMenu