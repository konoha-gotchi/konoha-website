import React, { useEffect, useRef } from 'react';
import styles from './message_list.module.css';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface MessageListProps {
    messages: Message[];
    isTyping?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className={styles.messageList}>
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`${styles.messageContainer} ${msg.sender === 'user' ? styles.userContainer : styles.botContainer}`}
                >
                    {msg.sender === 'bot' && (
                        <img src="/icon/mockplant.jpeg" alt="Bot Avatar" className={styles.avatar} />
                    )}
                    <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.botBubble}`}>
                        <p>{msg.text}</p>
                        <span className={`${styles.timestamp} ${msg.sender === 'user' ? styles.userTimestamp : ''}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
            
            {isTyping && (
                <div className={`${styles.messageContainer} ${styles.botContainer}`}>
                    <img src="/icon/mockplant.jpeg" alt="Bot Avatar" className={styles.avatar} />
                    <div className={styles.typingIndicator}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
