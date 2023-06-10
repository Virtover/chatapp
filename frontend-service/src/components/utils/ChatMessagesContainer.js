import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';

const ChatMessagesContainer = ({ messageInputHeight }) => {
    //TODO
    return (
        <div style={{height: `calc(100% - ${messageInputHeight}px - 10px)` }} className="ChatMessagesContainer">

        </div>
    );
}

export default ChatMessagesContainer;