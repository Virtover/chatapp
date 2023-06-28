import React, { useState } from 'react';
import { LS_LOGIN_DATA } from '../names';
import ChatMessageInput from './utils/ChatMessageInput';
import ChatMessagesContainer from './utils/ChatMessagesContainer';
import './styles/chat.css';

const Chat = ({ loginData, setLoginData }) => {
  const defaultMessageInputHeight = 40;
  const [messageInputHeight, setMessageInputHeight] = useState(defaultMessageInputHeight);

  const logout = () => {
    setLoginData(null);
    localStorage.removeItem(LS_LOGIN_DATA);
  };

  const username = JSON.parse(localStorage.getItem(LS_LOGIN_DATA)).username;
  console.log(username);

  return (
    <div className="Chat-container">
      <div className="Nav-bar">
        <button className="btn btn-primary" onClick={logout}>
          Logout
        </button>
        <div className="App-info">
          Chatapp
        </div>
        <div className="User-info"><strong>{username}</strong></div>
      </div>
      <div className="Chat-messages">
        <ChatMessageInput setMessageInputHeight={setMessageInputHeight} messageInputHeight={messageInputHeight} defaultMessageInputHeight={defaultMessageInputHeight} loginData={loginData} />
        <ChatMessagesContainer messageInputHeight={messageInputHeight} loginData={loginData} />
      </div>
    </div>
  );
};

export default Chat;