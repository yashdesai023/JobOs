import { useState, useRef, useEffect } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

export default function Playground() {
    // Session State
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Current Interaction State
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load from LocalStorage
    useEffect(() => {
        const savedHelper = localStorage.getItem('jobos_chat_sessions');
        if (savedHelper) {
            try {
                const parsed = JSON.parse(savedHelper);
                setSessions(parsed);
                if (parsed.length > 0) {
                    // Load the most recent session
                    const sorted = parsed.sort((a: ChatSession, b: ChatSession) => b.timestamp - a.timestamp);
                    setCurrentSessionId(sorted[0].id);
                    setMessages(sorted[0].messages);
                } else {
                    startNewChat();
                }
            } catch (e) {
                console.error("Failed to load history", e);
                startNewChat();
            }
        } else {
            startNewChat();
        }
    }, []);

    // Save sessions whenever they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('jobos_chat_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startNewChat = () => {
        const newId = Date.now().toString();
        const initialMsg: Message = { role: 'assistant', content: "Hello! I am your JobOs Assistant. How can I help you regarding your projects or job applications today?" };
        const newSession: ChatSession = {
            id: newId,
            title: 'New Chat',
            messages: [initialMsg],
            timestamp: Date.now()
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newId);
        setMessages([initialMsg]);
        if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close on mobile
    };

    const deleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);
        if (newSessions.length === 0) {
            startNewChat();
        } else if (currentSessionId === id) {
            setCurrentSessionId(newSessions[0].id);
            setMessages(newSessions[0].messages);
        }
        localStorage.setItem('jobos_chat_sessions', JSON.stringify(newSessions));
    };

    const updateCurrentSession = (updatedMessages: Message[], firstUserMsg?: string) => {
        setSessions(prev => prev.map(session => {
            if (session.id === currentSessionId) {
                const newTitle = (session.title === 'New Chat' && firstUserMsg)
                    ? (firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg)
                    : session.title;

                return {
                    ...session,
                    messages: updatedMessages,
                    title: newTitle,
                    timestamp: Date.now() // Update timestamp to move to top
                };
            }
            return session;
        }));
    };

    const loadSession = (session: ChatSession) => {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        let currentMsgs = [...messages];

        // Add user message
        if (!textOverride) {
            const userMessage: Message = { role: 'user', content: textToSend };
            currentMsgs = [...currentMsgs, userMessage];
            setMessages(currentMsgs);
            setInput('');
            // Update Session Title if it's the first user message
            updateCurrentSession(currentMsgs, textToSend);
        }

        setIsLoading(true);
        // Add placeholder for AI response
        const placeholderMsg: Message = { role: 'assistant', content: '' };
        currentMsgs = [...currentMsgs, placeholderMsg];
        setMessages(currentMsgs);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: textToSend,
                    session_id: currentSessionId || 'default'
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                aiResponse += textChunk;

                // Real-time UI update
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant') {
                        lastMsg.content = aiResponse;
                    }
                    return newMessages;
                });
            }

            // Final update to session storage after streaming is complete
            setMessages(finalState => {
                updateCurrentSession(finalState);
                return finalState;
            });

        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                lastMsg.content += "\n**Error**: Connection interrupted.";
                updateCurrentSession(newMessages);
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const reloadLastMessage = () => {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        if (lastUserMsg) {
            if (messages[messages.length - 1].role === 'assistant') {
                setMessages(prev => prev.slice(0, -1));
            }
            handleSend(lastUserMsg.content);
        }
    };

    const handleEdit = (text: string) => {
        setInput(text);
    };

    // Custom renderer for ReactMarkdown
    const components: Components = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="rounded-lg overflow-hidden my-4 shadow-lg border border-white/10">
                    <div className="bg-[#1e1e1e] px-4 py-1 flex justify-between items-center border-b border-white/5">
                        <span className="text-xs text-white/40 font-mono">{match[1]}</span>
                        <button
                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                            className="text-[10px] text-white/40 hover:text-white transition-colors"
                        >
                            Copy Code
                        </button>
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, background: '#1e1e1e' }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="bg-white/10 text-pink-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
            );
        },
        table({ children }) {
            return (
                <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                    <table className="min-w-full divide-y divide-white/10 text-sm text-left">
                        {children}
                    </table>
                </div>
            );
        },
        thead({ children }) {
            return <thead className="bg-white/5 text-white">{children}</thead>;
        },
        th({ children }) {
            return <th className="px-4 py-3 font-semibold tracking-wider text-purple-300 border-b border-white/10">{children}</th>;
        },
        td({ children }) {
            return <td className="px-4 py-3 border-b border-white/5 text-gray-300">{children}</td>;
        }
    };

    return (
        <div className="flex h-screen bg-[#050505] font-sans overflow-hidden">
            {/* Sidebar */}
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="bg-black/95 border-r border-white/5 flex flex-col pt-20 h-full overflow-hidden absolute md:relative z-20 shrink-0"
            >
                <div className="px-4 mb-6">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white/90 px-4 py-3 rounded-xl transition-all border border-white/5 hover:border-purple-500/30 group"
                    >
                        <div className="p-1.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span className="font-medium text-sm">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
                    <div className="px-3 pb-2 text-xs font-semibold text-white/30 uppercase tracking-widest">Recent Activity</div>
                    {sessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => loadSession(session)}
                            className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all group flex items-center justify-between
                                ${currentSessionId === session.id
                                    ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/10 text-white border border-purple-500/20'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <span className="truncate flex-1 pr-2">{session.title}</span>
                            <div
                                onClick={(e) => deleteSession(e, session.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5 text-xs text-white/20 text-center">
                    Stored locally in your browser
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative h-screen w-full">
                <Navbar />

                {/* Header & Toggle */}
                <div className="absolute top-24 left-4 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isSidebarOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>

                <div className="flex-1 flex flex-col pt-32 pb-4 px-4 max-w-5xl mx-auto w-full h-screen">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 relative rounded-3xl bg-[#0a0a0a] border border-white/5 p-6 shadow-2xl">
                        {messages.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-white/10 pointer-events-none">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white/20 mb-2">JobOs Brain</h2>
                                    <p>Select a chat or start a new one</p>
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group mb-8`}
                                >
                                    <div
                                        className={`
                                            relative max-w-[90%] md:max-w-[85%] rounded-2xl p-6 shadow-xl border transition-all
                                            ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/20 text-white rounded-tr-sm'
                                                : 'bg-[#111] border-white/5 text-gray-200 rounded-tl-sm'
                                            }
                                        `}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-p:leading-relaxed prose-headings:text-purple-300 prose-a:text-pink-400 prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-white/10 prose-td:border prose-td:border-white/10 prose-th:bg-white/5 prose-th:p-3 prose-td:p-3 max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={components}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap leading-relaxed text-base">{msg.content}</p>
                                        )}

                                        {/* Action Bar */}
                                        <div className={`
                                            absolute -bottom-8 ${msg.role === 'user' ? 'right-0' : 'left-0'} 
                                            opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2
                                        `}>
                                            <button
                                                onClick={() => copyToClipboard(msg.content)}
                                                className="text-[10px] uppercase tracking-wider text-white/30 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                Copy
                                            </button>

                                            {msg.role === 'user' && (
                                                <button
                                                    onClick={() => handleEdit(msg.content)}
                                                    className="text-[10px] uppercase tracking-wider text-white/30 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading Indicator */}
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-start pl-2"
                                >
                                    <div className="bg-[#111] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                        </div>
                                        <span className="text-xs text-white/30 font-mono uppercase tracking-widest">Processing</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="mt-4 flex-shrink-0 relative z-10 w-full max-w-4xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg transition-opacity opacity-50 group-hover:opacity-100" />
                            <div className="relative bg-[#111] border border-white/10 rounded-2xl p-2 flex items-end gap-2 shadow-2xl transition-colors group-hover:border-purple-500/30">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="w-full bg-transparent text-white placeholder-white/20 p-4 min-h-[60px] max-h-[200px] resize-none focus:outline-none custom-scrollbar text-[15px] font-light rounded-xl leading-relaxed"
                                    rows={1}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim()}
                                    className="mb-1 mr-1 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="text-center mt-3 flex justify-center gap-4 text-[10px] text-white/20 font-mono tracking-widest uppercase">
                            <span>Llama 3 Powered</span>
                            <span>•</span>
                            <span>JobOs Secure Env</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
