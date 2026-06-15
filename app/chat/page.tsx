"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from "./page.module.css";
import Navbar from "../globals_components/navbar";
import FooterNav from "../globals_components/footer";
import MessageList, { Message } from './components/message_list';
import MessageInput from './components/message_input';

/**
 * Chat Page
 * Allows users to communicate with their plant through a chat interface.
 */
export default function ChatPage() {
    // Initial welcome message from the plant
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Kono-Chan. How are you doing today? 🌿",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const [isTyping, setIsTyping] = useState(false);

    // Handle sending a new message
    const handleSendMessage = (text: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Mock bot response (simulate dynamic back-end behavior)
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(text),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500); // Increased delay slightly for better animation feel
    };

    // Simple mock response logic - easily replaceable with API call
    const getBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('water')) {
            return "I'm feeling a bit thirsty actually! A little water would be nice. 💧";
        } else if (lowerInput.includes('sun') || lowerInput.includes('light')) {
            return "I love the sunlight! The current light level is just perfect for me. ☀️";
        } else if (lowerInput.includes('how are you')) {
            return "I'm feeling great! My leaves are growing strong thanks to your care. 😊";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hi there! Always happy to chat with you. 🍃";
        } else {
            return "That's interesting! Tell me more about it. I'm all ears (or leaves)! 🌿";
        }
    };

    return (
        <>
            <Navbar focus="chat" />

            <main className={styles.main}>
                <div className={styles.container}>
                    
                    {/* Header */}
                    <header className={styles.header}>
                        <h1>Chat with Kono-Chan</h1>
                        <p>Ask her how she's feeling or just say hello!</p>
                    </header>

                    {/* Chat Interface Container */}
                    <div className={styles.chatWrapper}>
                        <MessageList messages={messages} isTyping={isTyping} />
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>

                </div>
            </main>

            <FooterNav focus="chat" />
        </>
    );
}
