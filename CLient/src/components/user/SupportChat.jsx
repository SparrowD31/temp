import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [awaitingMobile, setAwaitingMobile] = useState(false);
  const { user } = useAuth();

  const initialMessages = [
    { sender: 'bot', text: 'Welcome to our Chat Support! 👏' },
    { 
      sender: 'bot', 
      text: 'How can I help you with today?',
      options: [
        { id: 1, label: 'Product not received', response: 'We are sorry that you have not received your product yet. Please provide your registered email address.' },
        { id: 2, label: 'Return a product', response: 'We are sorry that you are not happy with our product. Could you please tell us what was the issue?',
          options: [
            { id: 'quality', label: 'Quality Issues', response: 'We apologize for the quality issues. Please provide your mobile number so we can assist you better.' },
            { id: 'damaged', label: 'Damaged Product', response: 'We apologize that you received a damaged product. Please provide your mobile number so we can assist you better.' }
          ]
        }
      ]
    }
  ];

  const initializeChat = async () => {
    setIsInitializing(true);
    try {
      for (const message of initialMessages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(prev => [...prev, message]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && !isInitializing) {
      initializeChat();
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
  };

  const handleOptionClick = async (option) => {
    setMessages(prev => [...prev, { sender: 'user', text: option.label }]);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (option.id === 1) {
      setMessages(prev => [...prev, { sender: 'bot', text: option.response }]);
      setAwaitingEmail(true);
      setAwaitingMobile(false);
    } else if (option.id === 2) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: option.response,
        options: option.options
      }]);
      setAwaitingEmail(false);
      setAwaitingMobile(false);
    } else if (option.id === 'quality' || option.id === 'damaged') {
      setMessages(prev => [...prev, { sender: 'bot', text: option.response }]);
      setAwaitingMobile(true);
      setAwaitingEmail(false);
    }
    
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);

    if (awaitingEmail) {
      if (!validateEmail(input.trim())) {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'The email address you entered is not valid. Please enter a valid email address.' 
        }]);
        setInput('');
        return;
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Thank you for providing your email address. We will get in touch with you shortly.' 
      }]);
      setIsLoading(false);
      setAwaitingEmail(false);
    } else if (awaitingMobile) {
      if (!validateMobile(input.trim())) {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: 'The mobile number you entered is not valid. Please enter a 10-digit mobile number without spaces or special characters.' 
        }]);
        setInput('');
        return;
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Thank you for providing your mobile number. Our support team will contact you shortly to assist with your return request.' 
      }]);
      setIsLoading(false);
      setAwaitingMobile(false);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = async () => {
    setMessages([]);
    setInput('');
    setAwaitingEmail(false);
    setAwaitingMobile(false);
    setIsLoading(false);
    setIsInitializing(false);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    initializeChat();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Customer Support</h3>
            <button 
              onClick={resetChat}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Start New Session
            </button>
          </div>
          <div className="h-[400px] p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-out forwards',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user' ? 'bg-black text-white' : 'bg-gray-100'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionClick(option)}
                            className="w-full text-left px-3 py-2 bg-white hover:bg-gray-50 rounded-md text-sm transition-colors border border-gray-200"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(isLoading || isInitializing) && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div 
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        style={{
                          animation: 'bounce 1s infinite',
                          animationDelay: '0ms'
                        }}
                      />
                      <div 
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        style={{
                          animation: 'bounce 1s infinite',
                          animationDelay: '200ms'
                        }}
                      />
                      <div 
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        style={{
                          animation: 'bounce 1s infinite',
                          animationDelay: '400ms'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  awaitingEmail 
                    ? "Enter your email address (e.g., example@domain.com)..." 
                    : awaitingMobile 
                      ? "Enter your 10-digit mobile number..." 
                      : "Type your message..."
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
              />
              <button 
                onClick={handleSendMessage}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(-25%); }
            50% { transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
}