'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { WelcomeScreen } from './welcome-screen';
import { MessageBubble, LoadingBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { ProductGrid } from './product-grid';
import { ChatProvider, useChat } from './chat-context';

/* -------------------------------------------------------------------------------------------------
 * Compound Components
 * -----------------------------------------------------------------------------------------------*/

function ChatFrame({ children }: { children: ReactNode }) {
    return <div className="flex h-screen flex-col bg-background">{children}</div>;
}

function ChatHeader() {
    const { state, actions } = useChat();
    return <Header onNewChat={actions.clearMessages} showNewChat={state.messages.length > 0} />;
}

function ChatMessages() {
    const { state, actions, meta } = useChat();
    const hasMessages = state.messages.length > 0;

    return (
        <main className="flex-1 overflow-y-auto">
            {!hasMessages ? (
                <WelcomeScreen onSelectAction={actions.send} disabled={state.isLoading} />
            ) : (
                <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
                    {state.messages.map((m) => (
                        <MessageBubble key={m.id} role={m.role} content={m.content}>
                            {m.products && m.products.length > 0 && (
                                <ProductGrid products={m.products} />
                            )}
                        </MessageBubble>
                    ))}
                    {state.isLoading && <LoadingBubble />}
                    <div ref={meta.scrollRef} />
                </div>
            )}
        </main>
    );
}

function ChatInputArea() {
    const { state, actions } = useChat();

    return (
        <footer className="border-t border-border bg-background p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                <ChatInput
                    value={state.input}
                    onChange={(e) => actions.updateInput(e.target.value)}
                    onSubmit={actions.submit}
                    disabled={state.isLoading}
                    placeholder="Search for products, ask for recommendations..."
                />
            </div>
        </footer>
    );
}

/* -------------------------------------------------------------------------------------------------
 * Exported Chat Object
 * -----------------------------------------------------------------------------------------------*/

export const Chat = {
    Provider: ChatProvider,
    Frame: ChatFrame,
    Header: ChatHeader,
    Messages: ChatMessages,
    Input: ChatInputArea,
};

/* -------------------------------------------------------------------------------------------------
 * Default Usage (Preserved)
 * -----------------------------------------------------------------------------------------------*/

export function ShopMateChat() {
    return (
        <Chat.Provider>
            <Chat.Frame>
                <Chat.Header />
                <Chat.Messages />
                <Chat.Input />
            </Chat.Frame>
        </Chat.Provider>
    );
}
