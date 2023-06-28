import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';
import { API_GATEWAY_WS_URL } from '../../config';

const ChatMessagesContainer = ({ messageInputHeight, loginData }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, date: new Date(), sender: "ultrauser", isFile: false, content: "Message 1" },
    { id: 2, date: new Date(), sender: "Jane", isFile: false, content: "Message 2" },
    { id: 3, date: new Date(), sender: "ultrauser", isFile: false, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 4, date: new Date(), sender: "Unknown", isFile: false, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 5, date: new Date(), sender: "ultrauser", isFile: false, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 6, date: new Date(), sender: "Andrzej", isFile: false, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 7, date: new Date(), sender: "Miriam", isFile: false, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 8, date: new Date(), sender: "ultrauser", isFile: false, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { id: 9, date: new Date(), sender: "filemaster", isFile: true, content: {filename: "sample.pdf", url: "https://example.com/sample.pdf", size: 1024 }},
    { id: 10, date: new Date(), sender: "ultrauser", isFile: true, content: {filename: "sample.pdf", url: "https://example.com/sample.pdf", size: 1024 }}
  ]); //json structure should be: {id, date, sender, isFile, content}
  const webSocketRef = useRef(null);

  useEffect(() => {
    if (messages.length < 100) {
      loadMoreMessages(100);
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${API_GATEWAY_WS_URL}/ws`); 
    webSocketRef.current = socket;
    socket.addEventListener('message', handleMessage);
    return () => {
      socket.close();
    };
  }, []);

  const handleMessage = (event) => {
    console.log('Received message:', event.data);
    return; //temp: we dont know event.data structure yet
    //TODO: check if message is already added
    setMessages(prevMessages => [...prevMessages, event.data]);
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = getFilenameFromUrl(url);
  
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = filename;
      anchor.click();
  
      URL.revokeObjectURL(anchor.href);
      anchor.remove();
    } catch (error) {
      console.error('Error occurred during file download:', error);
    }
  };
  
  const getFilenameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const handleScroll = (e) => {
    const bottom = 
      e.target.scrollHeight + e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      loadMoreMessages(50);
    }
  }

  const loadMoreMessages = (count) => {
    if (!loading) {
      setLoading(true);
      //TODO: Implement the logic to load more messages; similar to below but with real data; remember to check if message is already added
      const item = { id: null, date: new Date(), sender: "spammer", isFile: false, content: "older message there!" }; //starttemp
      setMessages(prevMessages => 
        [...prevMessages].concat(
          Array(count).fill(item).map((item, index) => ({ 
            ...item, 
            id: prevMessages.length + index + 1 
          }))
        )
      ); //endtemp

      setLoading(false);
    }
  };

  const dateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  const renderMessageContent = (message) => {
    if (message.isFile) {
      return (
        <div className="file-box" onClick={() => handleDownload(message.content.url)}>
          <i className="bi bi-file-earmark"></i>
          <div className="file-details">
            <div className="file-name">{message.content.filename}</div>
            <div className="file-size">{message.content.size} KB</div>
          </div>
        </div>
      );
    }
    return <div className="message-text">{message.content}</div>;
  };

  return (
    <div
      onScroll={handleScroll}
      className="ChatMessagesContainer container"
      style={{ height: `calc(100% - ${messageInputHeight}px - 10px)` }}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === loginData.username ? 'sent' : 'received'}`}
        >
          <div className="message-header">
            {message.sender}, {message.date.toLocaleString('en-GB', dateOptions)}
          </div>
          {renderMessageContent(message)}
        </div>
      ))}
    </div>
  );
};

export default ChatMessagesContainer;