import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import React ,{useState} from 'react'
import { SampleUsers } from '../constants/SampleData'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ isLoadingAddMember, addMember, chatId }) => {
    const [members, setMembers] = useState(SampleUsers)
    const [selectedMembers, setSelectedMembers] = useState([])
    

    const handleSelectMember = (id) => {
        setSelectedMembers((prev) => !prev.includes(id) ? [...prev, id] : prev.filter(item => item !== id))
    }

    const closeHandler = () => {
        setMembers([])
        setSelectedMembers([])
    }
    
    const addMemberSubmitHandler = () => {
        closeHandler()
     }

    return (
        <Dialog open maxWidth="xs" fullWidth onClose={closeHandler}>
            <div className='p-2 sm:p-4'>
                <DialogTitle>Add Member</DialogTitle>
                <div>
                    {
                        members.length > 0 ? members.map((member) => {
                            const isAdded=selectedMembers.includes(member._id)
                            return (
                                <UserItem
                                    key={member._id}
                                    handler={()=>handleSelectMember(member._id)}
                                    user={member}
                                    isAdded={isAdded}
                                />
                            )
                        }) : <h2 className='text-center text-slate-500'>No friends to show</h2>
                    }
                </div>
                <DialogActions className=''>
                    <button
                        className='danger-btn'
                    // onClick={}
                    >
                        Cancel
                    </button>
                    <button
                        className='success-btn'
                        onClick={addMemberSubmitHandler}
                    >
                        Submit Changes
                    </button>
                </DialogActions>

            </div>
        </Dialog>
    )
}

export default AddMemberDialog