import { useForm } from "react-hook-form";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatAI({ problem, selectedLanguage }) {
    const [messages, setMessages] = useState([
        {
            role: "model",
            parts: [{ text: "Hi! I'm your AI coding assistant, how can i help you?" }]
        }
    ]);

    const [loading, setLoading] = useState(false);

    const problemContext = {
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        description: problem.description.slice(0, 1200),
        visibleTestCases: problem.visibleTestCases,
        initialCode:
            problem.startCode.find(
                code => code.language === selectedLanguage
            )?.initialCode,
        language: selectedLanguage
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
                parts: [{ text: userMessage }]
            }
        ];

        const recentMessages = updatedMessages
            .filter(
                message =>
                    !(
                        message.role === "model" &&
                        message.parts[0].text.includes(
                            "Hi! I'm your AI coding assistant"
                        )
                    )
            )
            .slice(-6)
            .map(message => ({
                role: message.role,
                text: message.parts[0].text
            }));  // just for know for saving api

        setMessages(updatedMessages);
        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post(
                "/ai/chat",
                {
                    messages: recentMessages,
                    problem: problemContext
                }
            );

            const newModelMessage = {
                role: "model",
                parts: [{ text: response.data.message }]
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
                    parts: [{ text: "Sorry, I encountered an error." }]
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
                            className={`chat-bubble max-w-full overflow-x-auto ${message.role === "user"
                                    ? "chat-bubble-primary"
                                    : ""
                                }`}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-xl font-bold mb-3">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-lg font-bold mt-4 mb-2">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="font-semibold mt-3 mb-2">
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="leading-7 mb-2">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc ml-5 space-y-1">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal ml-5 space-y-1">
                                            {children}
                                        </ol>
                                    ),
                                    code({ inline, children }) {
                                        if (inline) {
                                            return (
                                                <code className="bg-base-300 px-1 rounded">
                                                    {children}
                                                </code>
                                            );
                                        }
                                        return (
                                            <pre className="bg-neutral text-neutral-content rounded-xl p-4 overflow-x-auto my-3">
                                                <code>
                                                    {children}
                                                </code>
                                            </pre>
                                        );
                                    }
                                }}
                            >
                                {message.parts[0].text}
                            </ReactMarkdown>
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
                            maxLength: 300
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