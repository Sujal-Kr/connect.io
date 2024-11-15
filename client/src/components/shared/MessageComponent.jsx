import { Avatar } from '@mui/material';
import React, { memo } from 'react';
import moment from 'moment';
import { fileFormat } from '../../lib/Features';
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({ message, user }) => {
	const { sender, content, attachments = [], createdAt } = message;

	const sameSender = sender?._id === user?._id
	const timeAgo = moment(createdAt).fromNow();

	return (
		<>
			<div
				className={`flex flex-col  gap-2 text-xs  justify-start
					 ${sameSender ? "items-end" : "items-start"} `}
			>
				<div className='p-2 rounded-lg bg-white max-w-md shadow'>
					{!sameSender && <p className='text-darkgreen font-semibold'>{sender?.name}</p>}
					{content && <p className=" text-gray-700 ">{content}</p>}
					{
						attachments && attachments.map((attachment, index) => {
							const url = attachment.url
							const file = fileFormat(url)
							return (
								<div key={index}>
									<a
										href=""
										target='_blank'
										download
									>
										<RenderAttachment url={url} file={file} />
									</a>
								</div>
							)
						})
					}
				</div>

				<p className='text-gray-400'>{timeAgo}</p>

			</div>
		</>
	);
};

export default memo(MessageComponent);
