import {
  AttachFileOutlined,
  EmojiEmotionsOutlined,
  Send,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import FileMenu from "../components/dialog/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import {
  ALERT,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useLoadChatDetails, useLoadMessageChunks } from "../hooks/api";
import { useSocketEvents } from "../hooks/socket";
import { removeNewMessagesAlert } from "../redux/slices/chat";
import { setIsFileMenu } from "../redux/slices/misc";
import { getSocket } from "../socket";
import { MessasgeLoader, TypingLoader } from "../components/layout/Loaders";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const [text, setText] = useState("");

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const socket = getSocket();

  const fileMenuRef = useRef(null);
  const timeOutRef = useRef(null);
  const bottomRef = useRef(null);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const {
    chat,
    loading: chatLoading,
    error: chatError,
  } = useLoadChatDetails(chatId);
  const {
    messages,
    setMessages,
    loading: messageLoading,
    error: messageError,
    totalPage,
  } = useLoadMessageChunks(chatId, page);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [data.message, ...prev]);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const alertMessage = {
        content: data.content,
        sender: {
          _id: "",
          name: "Random Owner",
        },
        chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [alertMessage, ...prev]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(false);
    },
    [chatId]
  );

  // If we write this code inside the useEffect instead of writing inside the return
  // then it will re render the compoent uncessarily when it is not required for the first time .
  // Writing the code inside the return will make sure that the peice of code only runs when the component
  // unmounts or chatId changes.

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setText("");
      setPage(1);
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [messages]);

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandlers);

  // useEffect(() => {
  //     const handleScroll = () => {
  //         const container = containerRef.current;
  //         if (!container) return;

  //         console.log('i am scrolling...')
  //         if (container.scrollTop < 20 && page < totalPage) {
  //             setPage((prev) => prev + 1);
  //         }
  //     };

  //     const container = containerRef.current;
  //     if (container) {
  //         container.addEventListener('scroll', handleScroll);
  //     }

  //     return () => {
  //         if (container) {
  //             container.removeEventListener('scroll', handleScroll);
  //         }
  //     };
  // }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members: chat?.members, message: text });
    setText("");
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
  };

  const handleChangeMessage = (e) => {
    setText(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { chatId, members: chat.members });
      setIamTyping(true);
    }
    if (timeOutRef) clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setIamTyping(false);
      socket.emit(STOP_TYPING, { chatId, members: chat.members });
    }, 2000);
  };

  return chatLoading ? (
    <MessasgeLoader/>
  ) : (
    <div className="flex flex-col h-[calc(100vh_-_5rem)] justify-start bg-noise p-3">
      <div
        ref={containerRef}
        className="flex-1 flex flex-col-reverse gap-2 overflow-y-auto"
      >
        {messageLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div ref={bottomRef} />
            {userTyping && <TypingLoader />}
            {messages?.map((message) => (
              <MessageComponent
                key={message?._id}
                message={message}
                user={user}
              />
            ))}
          </>
        )}
      </div>
      <form
        className="rounded-xl bg-white flex items-center justify-start m-1 p-4 gap-3 text-xs shadow-md"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          placeholder="Write your message..."
          className="w-full outline-none border-none !text-sm"
          value={text}
          onChange={handleChangeMessage}
        />
        <EmojiEmotionsOutlined
          className="text-slate-500"
          sx={{ fontSize: "1.2rem" }}
        />
        <AttachFileOutlined
          ref={fileMenuRef}
          onClick={handleFileOpen}
          className="text-slate-500"
          sx={{ fontSize: "1.2rem" }}
        />
        <button
          className="shadow-md rounded-lg bg-darkgreen text-white"
          type="submit"
        >
          <Send
            sx={{
              fontSize: "2rem",
              padding: "0.5rem",
              width: "2rem",
              height: "2rem",
              transform: "rotate(-30deg)",
            }}
          />
        </button>
      </form>
      <FileMenu anchor={fileMenuRef.current} chatId={chatId} />
    </div>
  );
};

export default AppLayout()(Chat);
