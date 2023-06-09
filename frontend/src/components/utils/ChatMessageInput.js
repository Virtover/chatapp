import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { API_GATEWAY_WS_URL } from '../../config';

const ChatMessageInput = ({ messageInputHeight, setMessageInputHeight, defaultMessageInputHeight, loginData }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const webSocketRef = useRef(null);
  const MAX_TEXTAREA_ROWS = 10;
  const MAX_TEXTAREA_CHARACTERS = 2000;

  useEffect(() => {
    const socket = new WebSocket(`${API_GATEWAY_WS_URL}/ws`); 
    webSocketRef.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      setMessageInputHeight(Math.min(
        textareaRef.current.scrollHeight,
        MAX_TEXTAREA_ROWS * parseFloat(getComputedStyle(textareaRef.current).lineHeight)
      ));
    }
  };

  const handleMessageChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= MAX_TEXTAREA_CHARACTERS) {
      setMessage(inputValue);
    }
  };

  const handleSubmitFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile != null && webSocketRef.current) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const base64String = btoa(
          new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
  
        const fileData = {
          username: loginData.username,
          token: loginData.token,
          isFile: true,
          content: base64String,
          filename: selectedFile.name
        };
  
        webSocketRef.current.send(JSON.stringify(fileData));
      };
  
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSubmitMessage = () => {
    if (message !== '' && webSocketRef.current) {
      const json = {username: loginData.username, token: loginData.token, isFile: false, content: message};
      webSocketRef.current.send(JSON.stringify(json));
    }
    setMessage('');
    setMessageInputHeight(defaultMessageInputHeight);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage();
    } else if (event.key === 'ArrowUp' && event.target.selectionStart === 0) {
      event.preventDefault();
      moveCursorToPreviousLine();
    } else if (event.key === 'ArrowDown' && event.target.selectionStart === event.target.value.length) {
      event.preventDefault();
      moveCursorToNextLine();
    }
  };

  const moveCursorToPreviousLine = () => {
    if (textareaRef.current) {
      const { selectionStart, value } = textareaRef.current;
      const lines = value.split('\n');
      const currentLineIndex = value.substr(0, selectionStart).split('\n').length - 1;

      if (currentLineIndex > 0) {
        const newPosition = selectionStart - lines[currentLineIndex].length - 1;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }
  };

  const moveCursorToNextLine = () => {
    if (textareaRef.current) {
      const { selectionStart, value } = textareaRef.current;
      const lines = value.split('\n');
      const currentLineIndex = value.substr(0, selectionStart).split('\n').length - 1;

      if (currentLineIndex < lines.length - 1) {
        const newPosition = selectionStart + lines[currentLineIndex].length + 1;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }
  };

  return (
    <form className="ChatMessageInput" style={{height: `${messageInputHeight}px` }}>
      <div className="input-group">
        <div className="input-group-prepend">
          <label htmlFor="fileInput" className="input-group-text">
            <FontAwesomeIcon icon={faPaperclip} />
          </label>
        </div>
        <input
          type="file"
          id="fileInput"
          className="form-control d-none"
          onChange={handleSubmitFile}
        />
        <textarea
          ref={textareaRef}
          className="form-control"
          placeholder="Type your message..."
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={MAX_TEXTAREA_CHARACTERS}
        />
        <div className="input-group-append">
          <button type="button" onClick={handleSubmitMessage} className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatMessageInput;
