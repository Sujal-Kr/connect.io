import React from 'react';
import ChatItem from '../shared/ChatItem';
import { SearchOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const ChatList = ({
  chats = [],
  chatId,
  onlineUser = [],
  newMessages = [{ chatId: "", count: 0 }],
  handleChatOption
}) => {
  const {user}=useSelector((state)=>state.auth)
  return (
    <div className='flex flex-col h-[calc(100vh_-_5rem)]'>
      <div className='p-6 flex flex-col gap-6 flex-shrink-0'>
        <h1 className='text-xl font-semibold'>Messages</h1>
        <div className='flex gap-2 border p-2 items-center bg-plain rounded-md'>
          <SearchOutlined className='text-gray-500' />
          <input
            type="text"
            name='search'
            placeholder='John doe'
            className='outline-none bg-transparent text-xs w-full'
          />
        </div>
      </div>
      <div className='flex-1 h-full overflow-y-auto'>
        {chats?.map((data, index) => {
          const { avatar, name, _id, members, groupChat } = data;
          const newMessageAlert = newMessages?.find(({ chatId }) => chatId === _id);
          const isOnline = onlineUser.includes(_id);
          const others=members.filter(({_id})=>_id!=user._id)
          
          return (
            <div
              key={index}
              className={`
                ${chatId !== _id && "hover:bg-[#edf2f4]/20"}
                ${chatId === _id ? "bg-[#edf2f4] border-r-4 border-primary" : ""}
              `}
            >
              <ChatItem
                index={index}
                newMessagesAlert={newMessageAlert}
                isOnline={isOnline}
                avatar={groupChat?avatar:others[0].avatar}
                name={groupChat?name:others[0].name}
                _id={_id}
                sameSender={chatId === _id}
                groupChat={groupChat}
                handleDeleteChatOption={handleChatOption}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;	