'use client';

import { useChatbot } from './ChatbotProvider';

export default function ChatbotToggle() {
  const { isOpen, toggleChatbot } = useChatbot();

  return (
    <button
      onClick={toggleChatbot}
      className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center"
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
    >
      {isOpen ? '✖' : '💬'}
    </button>
  );
}