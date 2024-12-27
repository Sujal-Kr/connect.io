import { SearchOutlined } from '@mui/icons-material'
import { Dialog } from '@mui/material'
import React, { useState } from 'react'
import { SampleUsers } from '../constants/SampleData'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { useLoadAvailableFriends } from '../../hooks/api'
import { LayoutLoader } from '../layout/Loaders'
import { setIsNewGroup } from '../../redux/slices/misc'
import toast from 'react-hot-toast'
import axios from 'axios'
import { server } from '../../constants/config'



const NewGroup = () => {
  const dispatch = useDispatch()

  const { data, loading, error } = useLoadAvailableFriends()
  const { isNewGroup } = useSelector((state) => state.misc)

  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState(SampleUsers)
  const [selectedMembers, setSelectedMembers] = useState([])

  const handleSelectMember = (id) => {
    setSelectedMembers((prev) => !prev.includes(id) ? [...prev, id] : prev.filter(item => item !== id))

  }

  const handleSubmit = async() => {

    const id = toast.loading("Creating a new group...")
    if (!groupName) {
      toast.error("Group Name cannot be empty",{id})
      return
    }
    if (selectedMembers && selectedMembers.length < 2) {
      toast.error("Minimum 2 members required",{id})
      return
    }
    try {
      const { data } =await  axios.post(`${server}/api/v1/chat/create`, { name: groupName, members: selectedMembers }, { withCredentials: true })
      if (data.success) {
        toast.success(data.message, { id })
       
        handleCloseDialog()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message,{id})
    }finally{

    }
  }

  const handleCancel = () => {
    setSelectedMembers([])
    setGroupName('')
    handleCloseDialog()
    
  }
  const handleCloseDialog = () => {
    dispatch(setIsNewGroup(false))
  }
  return (
    <Dialog open={isNewGroup} maxWidth='xs' fullWidth onClose={handleCloseDialog}>
      <div className='  p-4 md:p-6'>
        <h1 className='font-semibold'>Create new group</h1>
        <form className='flex items-center p-2 border rounded-md gap-2 my-3' >
          <SearchOutlined />
          <input
            type="text"
            name="groupname"
            placeholder='Search for your friends'
            className='text-xs outline-none w-full  border-none'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </form>
        <h4>Members</h4>
        {
          data?.length == 0 ? <h1>No Friends To Show</h1> :
            <div className={`mt-4`}>
              {
                loading ? <LayoutLoader /> : data?.map((user, index) => (
                  <div key={index} >
                    <UserItem
                      user={user}
                      handlerIsLoading={false}
                      handler={handleSelectMember}
                      isAdded={selectedMembers.includes(user._id)} />
                  </div>
                ))
              }
            </div>
        }
        <div className='flex justify-end gap-3 mt-5'>
          <button className='rounded-md px-4 py-2 text-sm text-primary bg-white shadow-md' onClick={handleCancel}>Cancel</button>
          <button className='rounded-md text-sm bg-primary text-white shadow-md px-4 py-2 ' onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </Dialog>
  )
}

export default NewGroup