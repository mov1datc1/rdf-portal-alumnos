import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Minus, Send, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export function ChatbotPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const session = useAuthStore(state => state.session);
  const user = useAuthStore(state => state.user);
  const firstName = user?.user_metadata?.firstName || 'Alumno';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Bonjour ${firstName} 👋 Puedo ayudarte a encontrar tu próxima clase, abrir un PDF o revisar tu avance.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Usar el ID del usuario Andrea insertado en el Seed (simulado aquí buscando su email o hardcoded para demo)
      // En una app real, este ID vendría del Contexto de Autenticación.
      // Como generamos a Andrea en el seed sin guardar el ID en local, el backend usará Prisma para encontrar el primer usuario
      // Haremos un pequeño "hack" pasando el email como userId para que el backend lo encuentre, o actualizamos el backend para buscar por email si pasamos un email.
      // O simplemente asumimos que el backend busca al primer usuario si mandamos un ID genérico.
      
      const response = await fetch('http://localhost:3000/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ 
          userId: user?.id || 'test-auth-id',
          email: user?.email || 'andrea@example.com', 
          message: userMessage.text 
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Désolé, no pude conectarme con el servidor. Intenta de nuevo más tarde.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#1D3A8A] text-white p-4 rounded-full shadow-xl hover:bg-blue-800 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[500px] z-50">
      {/* Header */}
      <div className="bg-[#1D3A8A] p-4 text-white flex justify-between items-start">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            Assistant Les Rois
          </h3>
          <p className="text-xs text-blue-200 mt-1 leading-tight">
            Ayuda con clases, PDFs, recursos y progreso
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "rounded-2xl p-3 shadow-sm max-w-[85%]",
              msg.sender === 'bot' 
                ? "bg-white border border-gray-100 rounded-tl-none text-slate-700" 
                : "bg-[#EF4444] text-white rounded-tr-none ml-auto"
            )}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[#1D3A8A] animate-spin" />
            <span className="text-xs text-slate-500">Pensando...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu duda..."
            className="w-full bg-slate-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]/20 focus:border-[#1D3A8A]"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-1 top-1 bottom-1 bg-[#1D3A8A] text-white px-3 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
