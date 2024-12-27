import Title from '../shared/Title'
import React, { useCallback, useEffect, useState } from 'react'
import Header from './Header'
import ChatList from '../specific/ChatList'
import { SampleChats } from '../constants/SampleData'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile } from '../../redux/slices/misc'
import { Drawer } from '@mui/material'
import { getSocket } from '../../socket'
import { useSocketEvents } from '../../hooks/socket'
import { ALERT, NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events'
import { increaseNewMessagesAlert, incrementNotificationCount } from '../../redux/slices/chat'
import { getOrSaveFromStorage } from '../../lib/Features'
import { useLoadChats } from '../../hooks/api'


const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const socket = getSocket()

        const params = useParams()
        const chatId = params.chatId

        const { user, loader } = useSelector((state) => state.auth)
        const { isMobile } = useSelector((state) => state.misc)
        const { newMessagesAlert } = useSelector((state) => state.chat)


        useEffect(() => {
            getOrSaveFromStorage({ key: [NEW_MESSAGE_ALERT], value: newMessagesAlert })
        }, [newMessagesAlert])

        const dispatch = useDispatch()
        // useEffect(() => {
        //     const loadChats = async () => {
        //         setLoading(true)
        //         try {
        //             const { data } = await axios.get(`${server}/api/v1/chat/me`, { withCredentials: true })

        //             if (data.success) {
        //                 setChats(data.chats)
        //             }
        //         } catch (err) {
        //             console.error(err.response?.data?.message)
        //         }
        //     }

        //     loadChats()
        //     setLoading(false)
        // }, [])

        const { chats, loading, error, refetch } = useLoadChats()
        // console.log()
        // console.log(chats)
        const handleIsMobile = () => {
            dispatch(setIsMobile(!isMobile))
        }
        const handleDeleteChat = () => {

        }
        const handleNewMessageAlert = useCallback((data) => {
            if (chatId === data.chatId) return
            dispatch(increaseNewMessagesAlert(data.chatId))
        }, [chatId])

        const handleNewRequest = useCallback(() => {
            console.log('new request')
            dispatch(incrementNotificationCount())
        }, [])

        const refetchListener = useCallback(() => {
            console.log('refetch chats')
            refetch()
        }, [])

        const socketHandlers = {
            [NEW_MESSAGE_ALERT]: handleNewMessageAlert,
            [NEW_REQUEST]: handleNewRequest,
            [REFETCH_CHATS]: refetchListener
        }
        useSocketEvents(socket, socketHandlers)
        return (
            <div className='flex flex-col gap-1 h-screen'>
                <Title />
                <Header />
                <Drawer open={isMobile} onClose={handleIsMobile}>
                    <div className='w-full md:hidden'>
                        <ChatList
                            chats={chats}
                            chatId={chatId}
                            onlineUser={["1", "2"]}
                            handleChatOption={handleDeleteChat}
                            newMessagesAlert={newMessagesAlert}
                        />
                    </div>
                </Drawer>
                <div className=' flex-1  grid grid-cols-12  bg-plain '>
                    <div className='hidden   sm:block sm:col-span-3 md:cols-3 bg-custom  '>
                        {
                            loading ? <div>Loading</div> :
                                (<ChatList
                                    chats={chats}
                                    chatId={chatId}
                                    onlineUser={["1", "2"]}
                                    handleChatOption={handleDeleteChat}
                                    newMessagesAlert={newMessagesAlert}
                                />)
                        }
                    </div>
                    <div className='col-span-12 sm:col-span-8 md:col-span-5  lg:col-span-6   '>
                        <WrappedComponent {...props} chatId={chatId} user={user} />
                    </div>
                    <div className='hidden md:block md:col-span-4 lg:col-span-3 p-2 h-full  bg-custom'>
                        {
                            loader || !user ? <div>Loading</div> :
                                <Profile user={user} />
                        }
                    </div>
                </div>
            </div>
        )

    }
}

export default AppLayout