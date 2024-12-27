import { Add, DeleteOutline, DoneOutline, Edit } from '@mui/icons-material'
import { Avatar, Drawer, Tooltip } from '@mui/material'
import { ArrowLeft, Menu } from 'lucide-react'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SampleChats, SampleUsers } from '../components/constants/SampleData'
import UserItem from '../components/shared/UserItem'
import { useLoadAvailableFriends, useLoadChatDetails, useLoadMyGroups } from '../hooks/api'
import { LayoutLoader } from '../components/layout/Loaders'
import axios from 'axios'
import { server } from '../constants/config'
import toast from 'react-hot-toast'

const ConfirmDeleteDialog = lazy(() => import('../components/dialog/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialog/AddMemberDialog'))
const isMember = false

const Groups = () => {
  const [searchParams] = useSearchParams()
  const chatId = searchParams.get('group')
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName, setGroupName] = useState("Group Name")
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('')
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

  const { data: groups, loading, error ,refetch} = useLoadMyGroups()
  const { chat } = useLoadChatDetails(chatId, true)


  useEffect(() => {
    if (chat) {
      setGroupName(chat.name)
      setGroupNameUpdatedValue(chat.name)
    }
    return () => {
      setGroupNameUpdatedValue('')
      setGroupName('')
      setIsEdit(false)
    }

  }, [chat])

  const handleDelete = () => { }
  const removeMemberHandler = (id) => {
    console.log('Remove handler', id)
  }
  const openConfirmDeleteGroupHandler = () => {
    setConfirmDeleteDialog(true)
  }
  const closeConfirmDeleteGroupHandler = () => {
    setConfirmDeleteDialog(false)
  }
  const openAddMemberHandler = () => { }

  const updateGroupName = async() => {
    setIsEdit(false)
    setGroupName(groupNameUpdatedValue)

    try {
      const { data } =await  axios.patch(`${server}/api/v1/chat/${chatId}`, { groupName: groupNameUpdatedValue }, { withCredentials: true })
      if (data.success) {
        toast.success(data.message)
        refetch()
      }
    } catch (err) {
      toast.error(err.response?.data.message || err.message)
    }
  }

  const handleMobile = () => {
    setIsMobile((prev) => !prev)
  }

  const handleBackButton = () => {
    navigate('/')
  }
  // useEffect(() => {
  //   if (chatId) {
  //     setGroupNameUpdatedValue(`Group Name ${chatId}`)
  //     setGroupName(`Group Name ${chatId}`)
  //   }
  //   return () => {
  //     setGroupNameUpdatedValue('')
  //     setGroupName('')
  //     setIsEdit(false)
  //   }
  // }, [chatId])

  const GroupName = (
    <div>
      {isEdit ? (
        <>
          <input
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <button onClick={updateGroupName}>
            <DoneOutline fontSize="small" />
          </button>
        </>
      ) : (
        <div className="flex justify-center items-center gap-2 p-3">
          <h4 className="text-xl">{groupName}</h4>
          <Edit
            onClick={() => setIsEdit(true)}
            className="text-sm cursor-pointer"
          />
        </div>
      )}
    </div>
  )

  const ActionButtons = () => {
    return (
      <div className="flex items-center justify-between sticky top-0 py-2">
        <Tooltip title="Back" className="w-fit">
          <div>
            <ArrowLeft
              onClick={handleBackButton}
              className="bg-white shadow-lg rounded-xl text-primary p-2 text-xl cursor-pointer transform hover:scale-125 hover:shadow"
              size={32}
            />
          </div>
        </Tooltip>
        <Menu
          className="block sm:hidden cursor-pointer"
          onClick={handleMobile}
          size={32}
        />
      </div>
    )
  }

  return loading ? <LayoutLoader /> : (
    <div className="grid grid-cols-12 h-screen">
      {/* Sidebar for larger screens */}
      <div className="hidden sm:block sm:col-span-4 border-r border-gray-200 overflow-hidden h-full">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h3 className="text-xl font-semibold">Group List</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <GroupList myGroups={groups} chatId={chatId} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="col-span-12 sm:col-span-8 h-full overflow-y-auto">
        <div className="py-8 px-4 sm:px-12">
          <ActionButtons />
          {groupName && GroupName}
          {chatId && (
            <div>
              <h4 className='text-slate-500'>Members</h4>
              <div className='w-full max-w-xl my-6 flex flex-col gap-4'>
                {chat?.members?.map((user) => (
                  <div className='border shadow rounded-xl bg-white px-4' key={user._id}>
                    <UserItem
                      user={user}
                      isAdded
                      handler={removeMemberHandler}
                    />
                  </div>
                ))}
              </div>
              <div className='font-montserrat flex flex-col-reverse sm:flex-row gap-2 sm:gap-8 items-center justify-center text-xs'>
                <button
                  onClick={openConfirmDeleteGroupHandler}
                  className='danger-btn flex items-center gap-1 justify-center'
                >
                  <DeleteOutline />
                  Delete Group
                </button>
                <button
                  onClick={openAddMemberHandler}
                  className='success-btn flex items-center gap-1 justify-center'
                >
                  <Add />
                  Add Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={isMobile} onClose={handleMobile}>
        <div className="w-64 h-full flex flex-col">
          <div className="p-4">
            <h3 className="text-xl font-semibold">Group List</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <GroupList myGroups={groups} chatId={chatId} />
          </div>
        </div>
      </Drawer>

      {isMember && (
        <Suspense fallback={<h1>Loading</h1>}>
          <AddMemberDialog
            addMember
            isLoadingMember
            chatId={chatId}
          />
        </Suspense>
      )}
      {confirmDeleteDialog && (
        <Suspense fallback={<h1>Loading...</h1>}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteGroupHandler}
            deleteHandler={handleDelete}
          />
        </Suspense>
      )}
    </div>
  )
}

// GroupList component
const GroupList = ({ myGroups = SampleChats, chatId }) => {
  return (
    <div className='flex flex-col gap-2'>
      {myGroups.length > 0 && myGroups.map((group) => (
        <GroupItem key={group._id} group={group} chatId={chatId} />
      ))}
    </div>
  )
}

const GroupItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group
  return (
    <Link to={`?group=${_id}`}
      onClick={(e) => { if (chatId === _id) e.preventDefault() }}
    >
      <div className="flex gap-2 items-center hover:bg-slate-50 p-2 rounded">
        <Avatar src={avatar[0]} />
        <p className="flex-1">{name}</p>
      </div>
    </Link>
  )
})

export default Groups