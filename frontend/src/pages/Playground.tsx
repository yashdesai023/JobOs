import { useState, useRef, useEffect } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LuPlus, LuTrash, LuCopy, LuPen, LuSend, LuBot, LuUser, LuTerminal } from 'react-icons/lu';
import { API_BASE_URL } from '../lib/api';

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
        const initialMsg: Message = { role: 'assistant', content: "JobOs Protocol Initialized. Ready for queries." };
        const newSession: ChatSession = {
            id: newId,
            title: 'New Session',
            messages: [initialMsg],
            timestamp: Date.now()
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newId);
        setMessages([initialMsg]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
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
                const newTitle = (session.title === 'New Session' && firstUserMsg)
                    ? (firstUserMsg.length > 20 ? firstUserMsg.substring(0, 20) + '...' : firstUserMsg)
                    : session.title;

                return {
                    ...session,
                    messages: updatedMessages,
                    title: newTitle,
                    timestamp: Date.now()
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

        if (!textOverride) {
            const userMessage: Message = { role: 'user', content: textToSend };
            currentMsgs = [...currentMsgs, userMessage];
            setMessages(currentMsgs);
            setInput('');
            updateCurrentSession(currentMsgs, textToSend);
        }

        setIsLoading(true);
        const placeholderMsg: Message = { role: 'assistant', content: '' };
        currentMsgs = [...currentMsgs, placeholderMsg];
        setMessages(currentMsgs);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant') {
                        lastMsg.content = aiResponse;
                    }
                    return newMessages;
                });
            }

            setMessages(finalState => {
                updateCurrentSession(finalState);
                return finalState;
            });

        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                lastMsg.content += "\n**System Error**: Connection to core interrupted.";
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

    const components: Components = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="rounded border border-white/10 overflow-hidden my-4 bg-[#0a0a0a]">
                    <div className="bg-white/5 px-4 py-1.5 flex justify-between items-center border-b border-white/5">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{match[1]}</span>
                        <button
                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                            className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                        >
                            <LuCopy size={10} /> Copy
                        </button>
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="bg-white/10 text-aurora-cyan px-1 5 py-0.5 rounded text-xs font-mono" {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div className="flex h-screen bg-void font-body overflow-hidden selection:bg-aurora-purple selection:text-white">
            {/* Sidebar */}
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="bg-black/40 border-r border-white/5 flex flex-col pt-24 h-full overflow-hidden absolute md:relative z-20 shrink-0 backdrop-blur-sm"
            >
                <div className="px-4 mb-8">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 px-4 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-all"
                    >
                        <LuPlus /> New Session
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-1">
                    <div className="px-2 pb-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">History</div>
                    {sessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => loadSession(session)}
                            className={`w-full text-left px-4 py-3 border-l-2 text-xs font-mono transition-all group flex items-center justify-between
                                ${currentSessionId === session.id
                                    ? 'border-aurora-purple bg-white/5 text-white'
                                    : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]'
                                }
                            `}
                        >
                            <span className="truncate flex-1 pr-2 uppercase tracking-wide">{session.title}</span>
                            <div
                                onClick={(e) => deleteSession(e, session.id)}
                                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-colors"
                            >
                                <LuTrash size={12} />
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative h-screen w-full">
                <Navbar />

                {/* Sidebar Toggle */}
                <div className="absolute top-24 left-6 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white/40 hover:text-white p-2 transition-colors"
                    >
                        <LuTerminal size={20} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col pt-32 pb-4 px-4 md:px-0 max-w-4xl mx-auto w-full h-screen">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 relative p-4 md:p-8">
                        {messages.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-white/10 pointer-events-none">
                                <div className="text-center font-mono text-xs uppercase tracking-widest">
                                    <p>System Ready.</p>
                                    <p className="mt-2 text-white/5">Start a new query.</p>
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
                                    <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                                        {/* Avatar */}
                                        <div className={`w-8 h-8 shrink-0 flex items-center justify-center border font-mono text-xs
                                            ${msg.role === 'user' ? 'border-white text-white' : 'border-aurora-cyan text-aurora-cyan'}
                                        `}>
                                            {msg.role === 'user' ? <LuUser /> : <LuBot />}
                                        </div>

                                        {/* Content */}
                                        <div className={`relative p-0 pt-1 transition-all ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-invert prose-p:font-light prose-p:text-white/80 prose-headings:font-display prose-headings:text-white prose-li:text-white/70 prose-strong:text-white prose-pre:bg-transparent prose-pre:p-0 max-w-none">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={components}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap font-light text-lg text-white/90">{msg.content}</p>
                                            )}

                                            {/* Action Bar */}
                                            <div className={`
                                                mt-2 flex gap-4 text-[10px] font-mono uppercase tracking-widest text-white/20
                                                ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
                                                opacity-0 group-hover:opacity-100 transition-opacity
                                            `}>
                                                <button onClick={() => copyToClipboard(msg.content)} className="hover:text-white transition-colors flex items-center gap-1">
                                                    <LuCopy size={10} /> Copy
                                                </button>
                                                {msg.role === 'user' && (
                                                    <button onClick={() => setInput(msg.content)} className="hover:text-white transition-colors flex items-center gap-1">
                                                        <LuPen size={10} /> Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading Indicator */}
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-4 pl-0">
                                    <div className="w-8 h-8 shrink-0 flex items-center justify-center border border-aurora-cyan text-aurora-cyan font-mono text-xs">
                                        <LuBot />
                                    </div>
                                    <div className="flex items-center gap-2 h-8">
                                        <span className="w-1.5 h-1.5 bg-aurora-cyan animate-pulse"></span>
                                        <span className="w-1.5 h-1.5 bg-aurora-cyan animate-pulse delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-aurora-cyan animate-pulse delay-150"></span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="mt-0 flex-shrink-0 relative z-20 w-full max-w-4xl mx-auto p-4">
                        <div className="relative group bg-[#050505] border-t border-white/10 pt-4">
                            <div className="relative flex items-end gap-2 transition-colors">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Input Command..."
                                    className="w-full bg-transparent text-white placeholder-white/20 pb-4 min-h-[50px] max-h-[200px] resize-none focus:outline-none custom-scrollbar font-mono text-sm uppercase tracking-wider"
                                    rows={1}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim()}
                                    className="mb-4 text-white/40 hover:text-white transition-colors disabled:opacity-20"
                                >
                                    <LuSend size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] mt-2">
                            <span>JobOs / AI Module v2.0</span>
                            <span>Llama 3 Instruct</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
