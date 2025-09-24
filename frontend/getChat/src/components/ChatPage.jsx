
import React, { useState, useRef, useEffect } from 'react';
import { MdAttachFile, MdSend } from 'react-icons/md';
import useChatContext from '../ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseUrl } from '../config/AxiosHelper';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages} from '../Services/RoomService';

export const ChatPage = () => {
    const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const chatBoxRef = useRef(null);

    //useEffect to hold prev chats
     useEffect(() => {
        setMessages([]);

        async function loadMessages() {
            try {
                if (roomId) {
                    const previousMessages = await getMessages(roomId);
                    
                   
                    setMessages(prevLiveMessages => {
                       
                        return [...previousMessages, ...prevLiveMessages];
                    });
                }
            } catch (error) {
                console.error("Failed to load messages", error);
                toast.error("Could not load previous messages.");
            }
        }
        loadMessages();
    }, [roomId]);





    //useEffect for mounting new chats 
    useEffect(() => {
        if (!connected) {
            navigate("/");
            return;
        }
        if (!roomId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${baseUrl}/chat`),
            onConnect: () => {
                console.log("WebSocket Connected!");
                toast.success("Connected!");
                setStompClient(client);

                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
            onStompError: (frame) => {
                console.error("Broker reported error: " + frame.headers['message']);
                toast.error("Connection error...");
            },
        });
        
        client.activate();

        return () => {
            if (client) {
                client.deactivate();
                console.log("WebSocket deactivated!");
            }
        };
    }, [connected, roomId, navigate]);

    const sendMessage = () => {
        if (stompClient && stompClient.connected && input.trim()) {
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
                timestamp: new Date(), // ✨ NEW: Timestamp added here
            };
            stompClient.publish({
                destination: `/app/sendMessage/${roomId}`,
                body: JSON.stringify(message),
            });
            setInput("");
        }
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    function handleLogout() {
        // ✅ FIX: Added a check to prevent crashing if client is null
        if (stompClient) {
            stompClient.deactivate();
        }
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
    }

    return (
        <div className='flex flex-col h-screen bg-gray-100 dark:bg-gray-800 text-white'>
            <header className='dark:border-b dark:border-gray-700 w-full bg-white dark:bg-gray-900 py-3 shadow flex justify-around items-center flex-shrink-0'>
                <div className='flex items-center gap-3'>
                    <span className='text-3xl text-blue-500 font-bold'>{`{}`}</span>
                    <div>
                        <h1 className='text-xl font-bold leading-tight'>getChat!</h1>
                        <p className='text-xs text-gray-400'>real-time chat</p>
                    </div>
                </div>
                <div><h1 className='text-lg font-semibold'>Room: <span className='font-normal text-blue-400'>{roomId}</span></h1></div>
                <div><h1 className='text-lg font-semibold'>User: <span className='font-normal text-green-400'>{currentUser}</span></h1></div>
                <div><button
                    onClick={handleLogout}
                    className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-semibold'>Leave Room</button></div>
            </header>

            <main ref={chatBoxRef} className='px-4 w-full md:w-2/3 mx-auto flex-grow overflow-auto py-4'>
                {messages.map((message, index) => (
                    <div key={index} className={`flex my-2 ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 max-w-lg rounded-xl shadow ${message.sender === currentUser ? "bg-green-600 rounded-br-none" : "bg-blue-600 rounded-bl-none"}`}>
                            <div className='flex flex-row gap-2 items-start'>
                                <img className="h-8 w-8 rounded-full" src={`https://avatar.iran.liara.run/public/boy?username=${message.sender}`} alt="avatar" />
                                <div className='flex flex-col'>
                                    <p className='text-sm font-bold'>{message.sender}</p>
                                    <p className='text-white break-words'>{message.content}</p>
                                    {/* ✨ NEW: Timestamp is rendered here */}
                                    {message.timestamp && (
                                        <span className='text-xs text-gray-300 self-end mt-1'>
                                            {new Date(message.timestamp).toLocaleString('en-US', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <div className='w-full bg-white dark:bg-gray-900 py-3 flex-shrink-0'>
                <div className='h-full px-4 md:px-10 gap-4 flex items-center justify-between rounded w-full md:w-2/3 mx-auto'>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        placeholder='Type your message here...'
                        className='border-gray-700 w-full bg-gray-800 px-5 py-3 rounded-full h-12 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onKeyPress={(event) => event.key === 'Enter' && sendMessage()}
                    />
                    <div className='flex gap-2'>
                        <button
                         onClick={()=>{
                            console.log("button working")
                            toast.error("upcoming update")
                        }}  className='bg-gray-700 hover:bg-gray-600 h-12 w-12 flex justify-center items-center rounded-full'>
                            
                            <MdAttachFile size={20} />

                        </button>
                        <button onClick={sendMessage} className='bg-green-600 hover:bg-green-700 h-12 w-12 flex justify-center items-center rounded-full'><MdSend size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};