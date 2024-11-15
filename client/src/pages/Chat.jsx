import { AttachFileOutlined, ContactSupportOutlined, EmojiEmotionsOutlined, Send } from '@mui/icons-material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import FileMenu from '../components/dialog/FileMenu'
import { SampleMessages } from '../components/constants/SampleData'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../socket'
import { NEW_MESSAGE } from '../constants/events'
import { server } from '../constants/config'
import axios from 'axios'
import { useSocketEvents } from '../hooks/socket'
import { useGetMessagesChunks } from '../hooks/api'
import { useInfiniteScrollTop } from '6pp'

const Chat = ({ chatId, user }) => {
    const containerRef=useRef(null)
    const [loading, setLoading] = useState(false)
    const [messageLoading, setMessageLoading] = useState(false)
    const [chat, setChat] = useState({})
    const [message, setMessage] = useState("")
    const socket = getSocket()
    const fileMenuRef = useRef(null)
    const [messages, setMessages] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const loadChatDetails = async (populate = false) => {
        setLoading(true)
        try {
            let url = `${server}/api/v1/chat/${chatId}`
            if (populate === true) url += "?populate=true"

            const { data } = await axios.get(url, { withCredentials: true })
            if (data.success) {
                setChat(data.chat)
            }
        } catch (err) {
            console.log(err.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    const handleNewMessage = useCallback((data) => {
        setMessages((prev) => [...prev, data.message])
    }, [])

    const handlerRefresh = useCallback((data) => {

    })
    const eventHandlers = { [NEW_MESSAGE]: handleNewMessage }
    useSocketEvents(socket, eventHandlers)


    useInfiniteScrollTop(containerRef,totalPage,page)

    useEffect(() => {
        loadChatDetails()
    }, [chatId])


    useEffect(() => {
        const loadMessagesChunks = async () => {
            setMessageLoading(true)
            try {
                const { data } = await axios.get(`${server}/api/v1/chat/message/${chatId}?page=${page}`,
                    { withCredentials: true })
                    
                if (data.success) {
                    // console.log(data.data)
                    setMessages(data.data)
                    setTotalPage(data.totalPage)
                }
            } catch (error) {
                // setError(error.response.data.message)
                console.error(error.response.data.message)
            }
            finally {
                setMessageLoading(false)
            }
        }
        loadMessagesChunks()
    }, [chatId, page])



    const handleSendMessage = (e) => {
        e.preventDefault()
       
        if (!message.trim()) return
        console.log(message)
        socket.emit(NEW_MESSAGE, { chatId, members: chat?.members, message })
        setMessage("")
    }

    return (
        loading ? (
            <div>Loading...</div>
        ) : (
            <div className='flex flex-col h-[calc(100vh_-_5rem)]  justify-start bg-noise p-3'>
                <div ref={containerRef} className='flex-1 flex flex-col gap-2  overflow-y-auto'>
                    {!messageLoading&&messages?.map((message) => (
                        <MessageComponent key={message?._id} message={message} user={user} />
                    ))}
                </div>
                <form
                    className='rounded-xl bg-white flex items-center justify-start m-1 p-4 gap-3 text-xs shadow-md'
                    onSubmit={handleSendMessage}
                >
                    <input
                        type="text"
                        placeholder='Write your message...'
                        className='w-full outline-none border-none !text-sm'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <EmojiEmotionsOutlined className='text-slate-500' sx={{ fontSize: '1.2rem' }} />
                    <AttachFileOutlined ref={fileMenuRef} className='text-slate-500' sx={{ fontSize: '1.2rem' }} />
                    <button className='shadow-md rounded-lg bg-darkgreen text-white' type='submit'>
                        <Send sx={{
                            fontSize: '2rem',
                            padding: '0.5rem',
                            width: '2rem',
                            height: '2rem',
                            transform: 'rotate(-30deg)'
                        }} />
                    </button>
                </form>
                <FileMenu />
            </div>
        )
    )
}

export default AppLayout()(Chat)
