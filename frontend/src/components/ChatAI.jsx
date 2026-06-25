import { useForm } from "react-hook-form";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

function ChatAI({ problem }) {
    const [messages, setMessages] = useState([
        {
            role: "model",
            content: "Hi! I'm your AI coding assistant. Ask me about this problem, hints, approaches, complexity analysis, or debugging."
        }
    ]);

    const [loading, setLoading] = useState(false);

    const problemContext = {
        title: problem.title,
        description: problem.description,
        visibleTestCases: problem.visibleTestCases
    };

    const { register, handleSubmit, reset } = useForm();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMessage = data.message?.trim();

        if (!userMessage) return;

        const updatedMessages = [
            ...messages,
            {
                role: "user",
                content: userMessage
            }
        ];

        const recentMessages = updatedMessages.slice(-6);  // just for know for saving api

        setMessages(updatedMessages);
        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post(
                "/chat/ai",
                {
                    messages: recentMessages,
                    problem: problemContext
                }
            );

            const newModelMessage = {
                role: "model",
                content:
                    response.data.message ||
                    response.data.content
            };

            setMessages((prev) => [
                ...prev,
                newModelMessage
            ]);
        }
        catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content:
                        "Sorry, I encountered an error."
                }
            ]);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-base-100">

            {/* Header */}

            <div className="sticky top-0 flex items-center gap-3 p-4 border-b border-base-300 bg-base-100 z-11">

                <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {/* <img
                            src="/forge-ai.png"
                            alt="Forge AI"
                        /> */}
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                            AI
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="font-bold text-lg">
                        Forge AI
                    </h2>

                    <p className="text-xs text-success">
                        ● Online
                    </p>
                </div>

            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat ${message.role === "user"
                            ? "chat-end"
                            : "chat-start"
                            }`}
                    >
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                                {message.role === "user" ? (
                                    <User size={18} />
                                ) : (
                                    <Bot size={18} />
                                )}
                            </div>
                        </div>

                        <div
                            className={`chat-bubble whitespace-pre-wrap ${message.role === "user"
                                ? "chat-bubble-primary"
                                : ""
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                                <Bot size={18} />
                            </div>
                        </div>

                        <div className="chat-bubble">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}

            <div className="bg-base-100 border-t border-base-300 p-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex gap-2"
                >
                    <input
                        {...register("message", {
                            required: true,
                            minLength: 1,
                            maxLength: 500
                        })}
                        placeholder="Ask AI about this problem..."
                        className="input input-bordered flex-1"
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        <Send size={18} />
                    </button>
                </form>

                <p className="text-xs text-base-content/50 mt-2">
                    Examples: "Give me a hint", "Explain brute force approach",
                    "Optimize my solution", "Explain time complexity"
                </p>
            </div>
        </div>
    );
}

export default ChatAI;