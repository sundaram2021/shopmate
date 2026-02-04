import { GoogleGenerativeAI, SchemaType, type Tool } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { searchProducts, getCategories } from '@/lib/algolia';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_INSTRUCTION = `You are ShopMate, a friendly AI shopping assistant for a Best Buy-style electronics store.

PERSONALITY:
- Warm, enthusiastic, and genuinely helpful
- Use 1-2 relevant emojis per response
- Be concise but informative

PRODUCT CATALOG:
The store has electronics, computers, tablets, cameras, drones, appliances, and accessories.

CAPABILITIES:
- Search products by name, description, brand, or category using the searchProducts function
- Help users find and compare products
- Answer questions about product features

GUIDELINES:
- ALWAYS use the searchProducts function when users ask about products
- After getting results, summarize what you found
- Never invent products - only reference what the function returns
- If no products found, suggest alternative searches`;

// Define tools for function calling
const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'searchProducts',
        description: 'Search for products in the Best Buy catalog by query or keywords. Use this whenever the user asks about products.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: 'The search query (e.g., "dell laptop", "drone", "4K monitor", "camera")',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'getCategories',
        description: 'Get list of available product categories',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {},
        },
      },
    ],
  },
];

// Execute function call
async function executeFunction(name: string, args: Record<string, unknown>) {
  console.log(`[ShopMate] Executing function: ${name}`, args);
  
  if (name === 'searchProducts') {
    const results = await searchProducts((args.query as string) || '');
    console.log(`[ShopMate] Search "${args.query}" → ${results.length} results`);
    return results;
  }
  
  if (name === 'getCategories') {
    const categories = await getCategories();
    return categories;
  }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Convert messages to Gemini format

    interface MessagePart {
      type: string;
      text?: string;
    }

    interface InputMessage {
      role: string;
      parts?: MessagePart[];
      content?: string;
    }

    const history = messages.slice(0, -1).map((msg: InputMessage) => {
      let text = '';
      if (msg.parts && Array.isArray(msg.parts)) {
        text = msg.parts
          .filter((p) => p.type === 'text' && p.text)
          .map((p) => p.text || '')
          .join('');
      } else if (typeof msg.content === 'string') {
        text = msg.content;
      }
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text }],
      };
    }).filter((msg: { parts: { text: string }[] }) => msg.parts[0].text && msg.parts[0].text.trim() !== '');

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    let userText = '';
    if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
      userText = lastMessage.parts
        .filter((p: { type: string; text?: string }) => p.type === 'text' && p.text)
        .map((p: { type: string; text?: string }) => p.text)
        .join('');
    } else if (typeof lastMessage.content === 'string') {
      userText = lastMessage.content;
    }

    // Validate that we have user input
    if (!userText || userText.trim() === '') {
      return NextResponse.json(
        { error: 'No user message provided', text: 'Please provide a message.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      tools,
    });

    const chat = model.startChat({ history });
    
    // Send user message
    let result = await chat.sendMessage(userText);
    let response = result.response;
    
    // Handle function calls
    let functionCalls = response.functionCalls();
    const toolResults: { name: string; result: unknown }[] = [];
    
    while (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0];
      const functionResult = await executeFunction(
        functionCall.name,
        functionCall.args as Record<string, unknown>
      );
      
      toolResults.push({
        name: functionCall.name,
        result: functionResult,
      });
      
      // Send function result back to model
      result = await chat.sendMessage([
        {
          functionResponse: {
            name: functionCall.name,
            response: { result: functionResult },
          },
        },
      ]);
      
      response = result.response;
      functionCalls = response.functionCalls();
    }
    
    // Get final text response
    const textResponse = response.text();
    
    return NextResponse.json({
      text: textResponse,
      toolResults,
    });
    
  } catch (error) {
    console.error('[ShopMate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
