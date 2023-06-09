import React from 'react';
import { LS_LOGIN_DATA } from '../names';
import "bootstrap/dist/css/bootstrap.min.css"
import './styles/chat.css'

const Chat = ({ setLoggedIn }) => {
  const logout = () => {
    localStorage.removeItem(LS_LOGIN_DATA);
    setLoggedIn(false);
  };

  return (
    <div className="Chat-container">
      <div className="Nav-bar">
        <button 
          className="btn btn-primary" 
          onClick={logout}
        >
          Logout
        </button>
        <div className="App-info">
          Chatapp
        </div>
      </div>
      <div className="Chat-messages">
        {/* Chat implementation */}
      </div>
      <div className="Chat-input form-group mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Type your message..." 
        />
        <button className="btn btn-outline-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;