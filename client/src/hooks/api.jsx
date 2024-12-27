import axios from "axios"
import { server } from "../constants/config"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const handleSendFriendRequestApi = async (userId) => {
    const [requestLoading, setrequesetLoading] = useState(false)
    const [requestError, setrequesetError] = useState("")
    const [data, setData] = useState([])
    const id = toast.loading("Sending friend request..")
    try {
        setrequesetLoading(true)
        const res = await axios.post(`${server}/api/v1/user/sendrequest}`, { userId }, { withCredentials: true })
        if (res.data.success) {
            setData(res.data.data)
            toast.success("Friend request sent", { id })
        }
    } catch (err) {
        toast.error(err.response.data.message, { id })
    } finally {
        setrequesetLoading(fale)
        setrequesetError("")
    }
    return { requestError, requestLoading, data }
}


const useLoadChats = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const loadChats = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${server}/api/v1/chat/me`, { withCredentials: true })
            // console.log(data)
            if (data.success) {
                setData(data.chats)
            }
        } catch (err) {

            setError(err.response?.data?.message || err.message)
            console.error(err.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadChats()
    }, [])
    
    return { chats: data, loading, error, refetch:loadChats}
}
const useLoadChatDetails = (chatId, populate = false) => {
    const [chat, setChat] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!chatId) return
        const loadChatDetails = async () => {
            setLoading(true);
            setError('')
            try {
                let url = `${server}/api/v1/chat/${chatId}`;
                if (populate) url += '?populate=true';

                const { data } = await axios.get(url, { withCredentials: true });
                if (data.success) {
                    setChat(data.chat);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load chat details")
                console.error(err.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }
        loadChatDetails()
    }, [chatId])

    return { chat, loading, error }
}

const useLoadMessageChunks = (chatId, page = 1) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    useEffect(() => {
        const loadinMessageChunks = async () => {
            setLoading(true)
            setError('')
            try {
                const { data } = await axios.get(
                    `${server}/api/v1/chat/message/${chatId}?page=${page}`,
                    { withCredentials: true }
                );

                if (data.success) {
                    setMessages((prev) => [...data.data]);
                    setTotalPage(data.totalPage);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message || "Failed to messages chunks")
                console.error(error.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }
        loadinMessageChunks()
    }, [chatId, page])

    return { messages, setMessages, loading, error, totalPage }
}

const useLoadMyGroups = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState("")
    const loadGroups = async () => {
        setLoading(true)
        setError("")
        try {

            const { data } = await axios.get(`${server}/api/v1/chat/me/groups`, { withCredentials: true })

            if (data.success) {
                setData(data.groups)
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadGroups()
    }, [])

    

    return { data, loading, error, refetch:loadGroups }
}

const useLoadAvailableFriends = (chatId) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const loadAvailableFriends = async () => {
            setLoading(true)
            setError("")
            try {
                let url = `${server}/api/v1/user/friends`
                if (chatId) url += `?chatId=/${chatId}`
                const { data } = await axios.get(url, { withCredentials: true })

                if (data.success) {
                    setData(data.friends)
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message)
            }
            finally {
                setLoading(false)
            }
        }
        loadAvailableFriends()
    }, [])

    return { data, loading, error }
}

export {
    handleSendFriendRequestApi,
    useLoadChatDetails,
    useLoadMessageChunks,
    useLoadMyGroups,
    useLoadAvailableFriends,
    useLoadChats
}