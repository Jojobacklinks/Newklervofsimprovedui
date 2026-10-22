import { useEffect, useRef, useState } from 'react';
import { Bot, ChevronRight, MessageSquare, Plus, Send, Sparkles, Trash2, UserRound } from 'lucide-react';
import { StaffAppPageHeading } from './StaffAppPageHeading';
import { StaffAppTabs } from './StaffAppTabs';
import './StaffAppAI.css';

type Message = { sender: 'user' | 'ai'; text: string; time: string };
type Chat = { id: string; title: string; messages: Message[]; updated: string };
export function StaffAppAI({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState('Chat');
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const current = chats.find(chat => chat.id === chatId);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (current?.messages.length) end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [current?.messages.length, typing]);
  const newChat = () => { if (timer.current) clearTimeout(timer.current); setTyping(false); setChatId(null); setDraft(''); setTab('Chat'); };
  const send = () => {
    if (!draft.trim() || typing) return;
    const text = draft.trim(); const time = new Date().toISOString(); const id = chatId || String(Date.now());
    const message: Message = { sender: 'user', text, time };
    setChats(previous => previous.some(chat => chat.id === id) ? previous.map(chat => chat.id === id ? { ...chat, messages: [...chat.messages, message], updated: time } : chat) : [{ id, title: text.slice(0, 60), messages: [message], updated: time }, ...previous].slice(0, 20));
    setChatId(id); setDraft(''); setTyping(true);
    timer.current = setTimeout(() => {
      const response: Message = { sender: 'ai', text: 'This is a preview of Klervo AI. Implement the same AI response function as in the browser, using only the information available to this staff member.', time: new Date().toISOString() };
      setChats(previous => previous.map(chat => chat.id === id ? { ...chat, messages: [...chat.messages, response], updated: response.time } : chat)); setTyping(false); timer.current = null;
    }, 700);
  };
  return <div className="sai"><StaffAppPageHeading title="Klervo AI" onBack={onBack} /><StaffAppTabs tabs={['Chat', 'History']} value={tab} onChange={setTab} label="Klervo AI sections" />
    {tab === 'Chat' ? <>
      {!current ? <div className="sai-welcome"><span className="sai-bot"><Sparkles size={28} /></span><h1>How can I help you today?</h1><p>Ask about your work, find your way around Klervo, or get help writing a customer message.</p><div className="sai-suggestions">{['What jobs do I have today?', 'How do I schedule a job', 'How do I create an estimate?', 'How do I add a new customer to Klervo?'].map(text => <button key={text} onClick={() => { setDraft(text); input.current?.focus(); }}><MessageSquare size={14} />{text}<ChevronRight size={14} /></button>)}</div></div> : <><div className="sai-chat-title"><h2>Chat with Klervo AI</h2><button className="sa-primary" onClick={newChat}><Plus size={13} />New Chat</button></div><section className="sai-messages" aria-label="Conversation" aria-live="polite">{current.messages.map((message, index) => <div className={`sai-message sai-message-${message.sender}`} key={index}><span className="sai-message-avatar">{message.sender === 'user' ? <UserRound size={15} /> : <Bot size={15} />}</span><div><p>{message.text}</p><time dateTime={message.time}>{new Date(message.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</time></div></div>)}{typing && <div className="sai-typing"><Bot size={16} /><span>Klervo AI is typing…</span></div>}<div ref={end} /></section></>}
      <form className="sai-composer" onSubmit={event => { event.preventDefault(); send(); }}><label className="sai-input-label" htmlFor="sai-message">Message Klervo AI</label><div><textarea id="sai-message" ref={input} rows={2} placeholder="Ask Klervo AI…" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} /><button type="submit" disabled={!draft.trim() || typing} aria-label="Send message"><Send size={17} /></button></div></form>
    </> : <><div className="sai-history-title"><h2>Chat History</h2><span>{chats.length} of 20 conversations</span></div>{chats.length ? <><button className="sa-primary sa-full" onClick={newChat}><Plus size={14} />New Chat</button>{[...chats].sort((a,b) => b.updated.localeCompare(a.updated)).map(chat => <section className="sa-card sai-history" key={chat.id}><button className="sai-history-open" onClick={() => { setChatId(chat.id); setTab('Chat'); setDraft(''); }}><h3>{chat.title}</h3><p>{chat.messages.length} messages · {new Date(chat.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></button><button className="sai-delete" aria-label={'Delete chat: ' + chat.title} onClick={() => { if (chat.id === chatId) newChat(); setChats(previous => previous.filter(item => item.id !== chat.id)); setTab('History'); }}><Trash2 size={15} /></button></section>)}</> : <section className="sa-card sai-empty"><Bot size={38} /><h3>No chat history yet</h3><p>Start a conversation with Klervo AI to see your chat history here.</p><button className="sa-primary sa-full" onClick={newChat}>Start New Chat</button></section>}</>}
  </div>;
}
