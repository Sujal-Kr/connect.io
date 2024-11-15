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
        const res = await axios.post(`${server}/api/v1/user/sendreques}`, { userId }, { withCredentials: true })
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



const useGetMessagesChunks = (chatId, page = 1) => {
    const [chunks, setChunks] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const loadMessagesChunks = async () => {
            setLoading(true)
            setError("")
            try {
                const { data } = await axios.get(`${server}/api/v1/chat/message/${chatId}?page=${page}`,
                    { withCredentials: true })
                if (data.success) {
                    setChunks[data.data]
                }
            } catch (error) {
                setError(error.response.data.message)
                console.error(error.response.data.message)
            }
            finally {
                setLoading(false)
            }
        }
        loadMessagesChunks()
    }, [chatId, page])
    return { chunks, loading, error }
}
export { handleSendFriendRequestApi, useGetMessagesChunks }