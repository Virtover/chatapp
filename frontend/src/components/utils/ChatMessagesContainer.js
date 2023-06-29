import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';
import { API_GATEWAY_WS_URL, API_GATEWAY_URL } from '../../config';

const ChatMessagesContainer = ({ messageInputHeight, loginData }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); //json structure should be: {id, date, sender, isFile, content}, if isFile then content is: {filename, url, size}
  const webSocketRef = useRef(null);

  useEffect(() => {
    if (messages.length < 100) {
      loadMoreMessages(100);
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${API_GATEWAY_WS_URL}/ws`); 
    webSocketRef.current = socket;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prevMessages => {
        if (prevMessages.filter(item => item.id === data.id).length === 0) {
          return [
            {id: data.id, 
            date: new Date(data.date), 
            sender: data.sender, 
            isFile: data.isFile, 
            content: data.content}, 
            ...prevMessages
          ];
        } else {
          return [...prevMessages];
        }
      });
    };
    return () => {
      socket.close();
    };
  }, []);

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
      const now = new Date().toISOString()
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: count,
          endDate: now,
        }),
      };

      fetch(`${API_GATEWAY_URL}/load_more`, options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((e) => {
            setLoading(false);
            throw new Error(e.detail || "Unknown error");
          });
        })
        .then((json) => {
          const filtered = json.messages.filter(item1 => !messages.some(item2 => item1.id === item2.id));
          setMessages(prevMessages => 
            [...prevMessages].concat(
              filtered.map((item, index) => ({ 
                id: prevMessages.length + index + 1,
                date: new Date(item.date),
                sender: item.sender,
                isFile: item.isFile,
                content: item.content
              }))
            )
          );
          setLoading(false);
        })
        .catch((e) => {
          const message = e.message;
          console.log(message);
          setLoading(false);
        });
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