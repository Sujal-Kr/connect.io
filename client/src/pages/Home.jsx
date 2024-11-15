import React from 'react'
import AppLayout from '../components/layout/AppLayout'
const Home = () => {
  return (
    <div className='p-8'>
        <h1 className='text-sm text-center'>Select a friend to chat</h1>
    </div>
  )
}

export default AppLayout()(Home)