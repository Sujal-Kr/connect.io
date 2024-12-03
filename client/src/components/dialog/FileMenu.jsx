import React, { useRef } from 'react'
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setIsUploadingLoader } from '../../redux/slices/misc'
import { FileIcon, ImageIcon, VideoIcon } from 'lucide-react'
import { AudiotrackOutlined } from '@mui/icons-material'
import toast from 'react-hot-toast'
import axios from 'axios'
import { server } from '../../constants/config'


const FileMenu = ({ anchor, chatId }) => {
  const { isFileMenu, isUploadingLoader } = useSelector((state) => state.misc)
  const dispatch = useDispatch()
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)
  const audioRef = useRef(null)

  const handleFileClose = () => {
    dispatch(setIsFileMenu(false))
  }

  const handleSendAttachments = async (formdata) => {
    
    try {
      const { data } = await axios.post(`${server}/api/v1/chat/message`, formdata, { withCredentials: true })
      if (data.success) return true
    } catch (err) {
      console.error(err.response?.data?.message)
      throw new Error(err.response?.data?.message || "Something went wrong")
    }
  }

  const handleFileChange = async (e, key) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return
    if (files.length > 5) {
      toast.error(`You can send up to 5 ${key} at a time`)
      handleFileClose()
      return
    }
    dispatch(setIsUploadingLoader(true))
    const toastId = toast.loading("Uploading Files...")
    handleFileClose()
    try {
      const formdata = new FormData()
      files.forEach((file) => {
        formdata.append("attachments", file)
      })
      formdata.append("chatId", chatId)
      
      const isUpload = await handleSendAttachments(formdata)
      if (isUpload) {
        toast.success("File Sent Successfully", { id: toastId })
      }
    } catch (err) {
      toast.error(err.message, { id: toastId })
    } finally {
      dispatch(setIsUploadingLoader(false))
      
    }
  }

  const handleSelectImageRef = () => imageRef.current?.click()
  const handleSelectVideoRef = () => videoRef.current?.click()
  const handleSelectAudioRef = () => audioRef.current?.click()
  const handleSelectFileRef = () => fileRef.current?.click()

  return (
    <Menu open={isFileMenu} anchorEl={anchor} onClose={handleFileClose}>
      <div className='w-32 text-xs'>
        <MenuList>
          <MenuItem onClick={handleSelectImageRef}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept='image/png,image/jpeg,image/gif'
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={handleSelectAudioRef}>
            <Tooltip title="Audio">
              <AudiotrackOutlined />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept='audio/mpeg,audio/wav'
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={handleSelectVideoRef}>
            <Tooltip title="Video">
              <VideoIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept='video/mp4,video/webm,video/ogg'
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem onClick={handleSelectFileRef}>
            <Tooltip title="Files">
              <FileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept='*'
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu
