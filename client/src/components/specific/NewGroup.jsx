import { SearchOutlined } from '@mui/icons-material'
import { Dialog } from '@mui/material'
import React, { useState } from 'react'
import { SampleUsers } from '../constants/SampleData'
import UserItem from '../shared/UserItem'



const NewGroup = () => {

  const [groupName, setGroupName] = useState()
  const [members, setMembers] = useState(SampleUsers)
  const [selectedMembers, setSelectedMembers] = useState([])

  const handleSelectMember = (id) => {
    setSelectedMembers((prev) => !prev.includes(id) ? [...prev, id] : prev.filter(item => item !== id))

  }

  const handleSubmit = () => { }
  const handleCancel = () => { }
  const handleCloseDialog = () => { }
  return (
    <Dialog open={handleCloseDialog}  maxWidth='xs' fullWidth>
      <div className='  p-4 md:p-6'>
        <h1 className='font-semibold'>Create new group</h1>
        <div className='flex items-center p-2 border rounded-md gap-2 my-3' >
          <SearchOutlined />
          <input
            type="text"
            placeholder='Search for your friends'
            className='text-xs outline-none w-full  border-none'
          />
        </div>
        <h4>Members</h4>
        {
          members?.length == 0 ? <h1>Notification is empty</h1> :
            <div className={`mt-4`}>
              {
                members.map((user, index) => (
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
          <button className='rounded-md px-4 py-2 text-sm text-primary bg-white shadow-md'>Cancel</button>
          <button className='rounded-md text-sm bg-primary text-white shadow-md px-4 py-2 '>Create</button>
        </div>
      </div>
    </Dialog>
  )
}

export default NewGroup