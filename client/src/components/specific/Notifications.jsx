import { CheckOutlined, DeleteOutline } from '@mui/icons-material'
import { Avatar, Dialog } from '@mui/material'
import React, { memo, Suspense, useEffect, useState } from 'react'
import { SampleNotifications } from '../constants/SampleData'
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotifications } from '../../redux/slices/misc'
import toast from 'react-hot-toast'

const Notifications = () => {
  const data = SampleNotifications
  const { isNotifications } = useSelector((state) => state.misc)
  const [notifications, setNotifications] = useState([])
  const dispatch = useDispatch()

  const handleFriendRequest = async (id, action) => {
    console.log(id, action)
    console.log(action ? "Accepted" : "Rejected")
    try {
      const { data } = await axios.patch(`${server}/api/v1/user/acceptrequest`,
        { requestId: id, accept: action }, { withCredentials: true })
      if (data.success) {
        toast.success(`you are now friends with ${data.sender.name}`)
      }
    } catch (err) {
      toast.error(err.response.data.message || "Something went wrong")
    }
  }
  const handleCloseNotificationDialog = () => {
    dispatch(setIsNotifications(false))
  }
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/user/notifications`, { withCredentials: true })
        if (data.success) {
          console.log(data.notifications[0])
          setNotifications(data.notifications)
        }
      } catch (err) {
        toast.error(err.response.data.message || "Failed to fetch notifications")
      }
    }
    getNotifications()
  }, [])
  return (
    <Dialog open={isNotifications} onClose={handleCloseNotificationDialog} fullWidth maxWidth='xs'>
      <div className=' p-4'>
        <h1 className='font-semibold'>Notifications</h1>
        {
          notifications?.length == 0 ? <h5 className='text-slate-400 text-center my-8 text-xs'>Nothing to show</h5> :
            <div className='mt-4'>
              <Suspense fallback={<div>Loading...</div>}>
                {notifications?.map((notification, index) => (
                  <div
                    key={notification._id}
                    className={`${index < notifications.length - 1 ? "border-b" : ""}`}
                  >
                    <NotificationItem
                      _id={notification._id}
                      sender={notification.sender}
                      handler={handleFriendRequest}
                    />
                  </div>
                ))}
              </Suspense>
            </div>
        }
      </div>
    </Dialog>
  )
}


export default Notifications


const NotificationItem = memo(({ sender, _id, handler }) => {
  console.log(`Notification`, _id)
  const { name, avatar } = sender
  return (
    <div className='p-2 flex justify-start items-center gap-3 w-full '>
      <Avatar src={avatar} />
      <p className='flex-1 line-clamp-1 text-sm font-semibold '>{name || "Sujal Kumar"}</p>
      <div className='action-btn flex gap-2'>
        <button
          onClick={() => handler(_id, true)}
          className='text-primary'>
          <CheckOutlined />
        </button>
        <button
          onClick={() => handler(_id, false)}
          className='text-red-200'>
          <DeleteOutline />
        </button>
      </div>
    </div>
  )
})