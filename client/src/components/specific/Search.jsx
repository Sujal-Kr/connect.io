import { SearchOutlined } from '@mui/icons-material'
import { Dialog } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { server } from '../../constants/config'
import { setIsSearch } from '../../redux/slices/misc'
import UserItem from '../shared/UserItem'


const Search = () => {

	// const users = SampleUsers

	const [users, setUsers] = useState([])
	const [text, setText] = useState('')
	const [loading, setLoading] = useState(false)
	const [friendRequestLoading, setFriendRequestLoading] = useState(false)
	const { isSearch } = useSelector((state) => state.misc)
	const dispatch = useDispatch()

	
	const handleFriendRequest = async (id) => {  
		console.log("Triggerig the friend request function")
		setFriendRequestLoading(true)

		const toastId = toast.loading("Sending friend request...");
		try { 
		  const { data } = await axios.post(
			`${server}/api/v1/user/sendrequest`, 
			{ userId: id }, 
			{ withCredentials: true }
		  );
		  if (data.success) {
			toast.success("Friend request sent ",{id:toastId});
		  }
		} catch (err) {
		  // Update the loading toast to show error
		  toast.error(err.response?.data?.message || "Something went wrong",{id:toastId});
		}finally{
			setFriendRequestLoading(false)
		}
	  };
	  
	const handleCloseSearch = () => {
		dispatch(setIsSearch(false))
	}
	useEffect(() => {
		
		const handleSearchUser = async () => {
			try {
				setLoading(true)
				const { data } = await axios.get(`${server}/api/v1/user/search?name=${text.trim()}`,
					{ withCredentials: true })
				if (data.success) {
					setUsers(data.users)
				}
				setLoading(false)
			} catch (err) {
				setLoading(false)
				console.log("error", err.response.data.message)
			}
		}
		const id = setTimeout(() => {
			handleSearchUser()
		}, [1000])
		return () => {
			clearTimeout(id)
		}
	}, [text])

	return (
		<Dialog open={isSearch} onClose={handleCloseSearch} fullWidth maxWidth={'xs'}>
			<div className=' p-6 flex gap-2 flex-col '>
				<h4 className='text-center'>Connect with your friends</h4>
				<form className="mt-4" >
					<div className='flex gap-2  border p-2 items-center  rounded-md'>
						<SearchOutlined className='text-primary' />
						<input
							type="text"
							name='search'
							placeholder='Jhon doe'
							value={text}
							className='outline-none  text-xs w-full'
							onChange={(e) => setText(e.target.value)}
						/>
					</div>
				</form>
				<div className='h-40 overflow-y-auto'>
					{
						users.map((user, index) => (
							<div key={index} >
								<UserItem
									user={user}
									handlerIsLoading={friendRequestLoading}
									handler={handleFriendRequest}
								/>
							</div>
						))
					}
				</div>
			</div>
		</Dialog>
	)
}

export default Search