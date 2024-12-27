import {
	AddOutlined as AddIcon,
	GroupOutlined as GroupIcon,
	LogoutOutlined as LogoutIcon,
	MenuOutlined as MenuIcon,
	NotificationsOutlined as NotificationsIcon,
	SearchOutlined as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import React, { lazy, Suspense, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { server } from '../../constants/config';
import { userNotExists } from '../../redux/slices/auth';
import { setIsMobile, setIsNewGroup, setIsNotifications, setIsSearch } from '../../redux/slices/misc';
import { Badge } from '@mui/material';
import { resetNotificationCount } from '../../redux/slices/chat';

// Lazy loading components
const NewGroup = lazy(() => import('../specific/NewGroup'));
const Search = lazy(() => import('../specific/Search'));
const Notifications = lazy(() => import('../specific/Notifications'));

const Header = () => {


	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isSearch, isNotifications,isNewGroup } = useSelector((state) => state.misc);
	const { notificationCount } = useSelector((state) => state.chat);
	

	// const [isNewGroup, setIsNewGroup] = useState(false);
	const { isMobile } = useSelector((state) => state.misc)


	// Handlers
	const handleAdd = () => {
		dispatch(setIsNewGroup(true))
	};
	const handleOpenSearch = () => {
		dispatch(setIsSearch(true));
	};
	const handleOpenNotifications = () => {
		dispatch(setIsNotifications(true));
		dispatch(resetNotificationCount());
	}
	const handleLogout = async () => {
		try {
			const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })

			if (data.success) {
				dispatch(userNotExists())
				toast.success("See you again!")
			}
		} catch (err) {
			console.error(err.response?.data?.message || "Something went wrong")
		}
		// Implement logout functionality
	};
	const handleGroup = () => {
		navigate('/groups');
	};
	const handleMenuBar = () => {
		// Implement menu bar functionality
		dispatch(setIsMobile(!isMobile))
	};
	const IconStyling={
		fontSize: "2rem",
		padding: '5px',
		fontWeight: "100",
		"&:hover": {  // Correct hover syntax
			borderRadius: "12px",
			backgroundColor: "#fff",
			color: "#4361ee !important",
			boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
			transform: "scale(1.1)",
			transitionDuration: "1000ms"

		}
	}

	const menu = [
		{
			title: 'New Group',
			icon: AddIcon,
			handler: handleAdd
		},
		{
			title: 'Manage Group',
			icon: GroupIcon,
			handler: handleGroup
		},
		{
			title: 'Search',
			icon: SearchIcon,
			handler: handleOpenSearch
		},
		{
			title: 'Notifications',
			icon: NotificationsIcon,
			handler: handleOpenNotifications,
			value:notificationCount
		},
		{
			title: 'Logout',
			icon: LogoutIcon,
			handler: handleLogout
		},
	];

	return (
		<div className='p-4 flex justify-between bg-slate-100  shadow md:shadow-none text-slate-400'>
			<div className='flex items-center'>
				<MenuIcon
					sx={{
						display: { xs: 'block', md: 'none' }
					}}
					onClick={handleMenuBar}
				/>
				<Link to='/' className='text-2xl hidden md:block text-primary font-semibold'>Connect.io</Link>
			</div>

			<nav className='items flex gap-5'>
				{menu.map((item, index) => (
					<div
						key={index}
						onClick={item.handler}
						className='flex gap-1 items-center cursor-pointer'
					>
						{
							item.value?<Badge badgeContent={item.value} sx={{color:"blue"}}><item.icon sx={IconStyling}/></Badge>:<item.icon
							sx={IconStyling}
						/>
						}

						<h4 className='text-xs hidden '>{item.title}</h4>
					</div>
				))}
			</nav>

			{/* Render lazy-loaded components */}
			{isNewGroup && (
				<Suspense fallback={<h1>Loading item...</h1>}>
					<NewGroup />
				</Suspense>
			)}
			{isNotifications && (
				<Suspense fallback={<h1>Loading item...</h1>}>
					<Notifications />
				</Suspense>
			)}
			{isSearch && (
				<Suspense fallback={<h1>Loading item...</h1>}>
					<Search />
				</Suspense>
			)}
		</div>
	);
};

export default Header;
