import { FileIcon } from 'lucide-react'
import React from 'react'
import { transformImage } from '../../lib/Features'

const RenderAttachment = ({ file, url }) => {
	switch (file) {
		case "image":
			return <img
				src={transformImage(url,200)}
				alt='attachemnt'
				className='h-40 w-32 object-contain'
			/>
		case "audio":return <audio src={url} controls preload='none'/>
		default: return <FileIcon/>
	}
}

export default RenderAttachment