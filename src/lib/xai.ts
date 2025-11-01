export const sendChatMessage = async (message: string, conversationHistory: any[] = []) => {
  const response = await fetch('/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        ...conversationHistory,
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
  }

  return response.text(); // since the backend streams text
};
