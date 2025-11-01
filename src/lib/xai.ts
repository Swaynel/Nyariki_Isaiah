export const xaiConfig = {
  baseUrl: 'https://api.x.ai/v1'
};

export interface ChatCompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens: number;
}

export const sendChatMessage = async (message: string, conversationHistory?: any[]) => {
  const response = await fetch('/api/chatbot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [
        { role: 'system', content: 'You are Sayan-Ai, a helpful AI assistant created by xAI.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response from Grok.';
};