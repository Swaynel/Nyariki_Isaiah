import { NextRequest } from 'next/server';
import { CohereClient } from 'cohere-ai';

export const runtime = 'nodejs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    if (!process.env.COHERE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages }: { messages: Message[] } = await req.json();

    // Validate messages
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract last message and chat history
    const lastMessage = messages[messages.length - 1];
    const chatHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? ('USER' as const) : ('CHATBOT' as const),
      message: m.content,
    }));

    const response = await cohere.chatStream({
      model: 'command-a-03-2025',
      message: lastMessage.content, // ✅ Added this required field
      preamble: `
        You are **Sayan-AI**, the friendly AI assistant for Isaiah Nyariki's personal portfolio site.
        You can read and understand the content of the page you're hosted on.
        Visitors come here to learn about Isaiah — his background, skills, projects, and how to contact him.
        Be conversational, warm, and informative.
        When someone asks about "this page," "the developer," or "Isaiah,"
        describe who he is: a passionate developer focused on modern web apps, design, and technology.
        Keep answers concise, natural, and helpful.
      `,
      chatHistory: chatHistory,
      temperature: 0.7,
    });

    // ✅ Create streaming response manually
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of response) {
            if (event.eventType === 'text-generation') {
              controller.enqueue(encoder.encode(event.text));
            } else if (event.eventType === 'stream-end') {
              controller.close();
              break;
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    // Return as a streaming response with proper headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal Server Error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}