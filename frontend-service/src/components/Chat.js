import React, { useState } from 'react';
import { LS_LOGIN_DATA } from '../names';
import ChatMessageInput from './utils/ChatMessageInput';
import './styles/chat.css';

const Chat = ({ setLoggedIn }) => {
  const defaultMessageInputHeight = 40;
  const [messageInputHeight, setMessageInputHeight] = useState(defaultMessageInputHeight);

  const logout = () => {
    localStorage.removeItem(LS_LOGIN_DATA);
    setLoggedIn(false);
  };

  return (
    <div className="Chat-container">
      <div className="Nav-bar">
        <button className="btn btn-primary" onClick={logout}>
          Logout
        </button>
        <div className="App-info">
          Chatapp
        </div>
      </div>
      <div className="Chat-messages">
        {/* Chat implementation */}
        <ChatMessageInput setMessageInputHeight={setMessageInputHeight} messageInputHeight={messageInputHeight} defaultMessageInputHeight={defaultMessageInputHeight}/>
        <div/>
      </div>
    </div>
  );
};

export default Chat;