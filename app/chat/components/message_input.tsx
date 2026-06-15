import React, { useState } from 'react';
import styles from './message_input.module.css';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                className={styles.inputField}
                placeholder="Type a message to your plant..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button className={styles.sendButton} onClick={handleSend}>
                <img src="/icon/leaves.png" alt="Send" />
            </button>
        </div>
    );
};

export default MessageInput;
