"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

type Message = {
    text: string;
    sender: "user" | "bot";
};

const Chatbot = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const URL = process.env.NEXT_PUBLIC_API_URL;


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!question.trim()) return;

        setMessages((prev) => [...prev, { text: question, sender: "user" }]);
        setQuestion("");

        try {
            const response = await fetch(URL + "chatbot/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: question }),
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { text: data.message, sender: "bot" }]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed bottom-8 right-5 z-50 flex flex-col items-end">
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="bg-blue-600 p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                    <FiMessageCircle className="text-white w-6 h-6" />
                </button>
            )}
            <div
                className={`transition-all duration-300 transform ${chatOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    } w-[22rem] bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden`}
            >
                {chatOpen && (
                    <div className="flex flex-col p-4">
                        <div className="flex justify-between items-center mb-2">
                            <button
                                onClick={() => setMessages([])}
                                className="text-xs bg-gray-200 px-2 py-1 rounded-lg hover:bg-gray-300 transition"
                            >
                                Limpiar chat
                            </button>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                            >
                                <IoClose className="w-4 h-4" />
                            </button>
                        </div>

                        <div
                            ref={chatContainerRef}
                            className="h-64 overflow-y-auto bg-gray-50 p-2 rounded-xl mb-2 flex flex-col space-y-2 scrollbar-thin scrollbar-thumb-gray-300"
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === "user"
                                        ? "bg-blue-500 text-white self-end"
                                        : "bg-gray-200 text-gray-900 self-start"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center">
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="bg-gray-100 rounded-xl px-2 py-2 h-[3rem] w-full outline-none"
                                type="text"
                                placeholder="Escribe un mensaje..."
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white rounded-xl px-3 h-[3rem] ml-2 hover:bg-blue-600 transition"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chatbot;
