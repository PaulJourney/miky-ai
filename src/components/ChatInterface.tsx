import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Robot } from '@phosphor-icons/react'
import type { Conversation } from '../App'

interface ChatInterfaceProps {
  conversation: Conversation
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInterface({ conversation, isLoading }: ChatInterfaceProps) {
  const getPersonaIcon = (persona: string) => {
    const icons = {
      lawyer: '⚖️',
      engineer: '🛠️',
      marketer: '📈',
      coach: '💬',
      medical: '🏥',
      'god-mode': '🌌'
    }
    return icons[persona as keyof typeof icons] || '🤖'
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {getPersonaIcon(conversation.persona)} {conversation.persona.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
        <span className="text-xs text-muted-foreground">{conversation.title}</span>
      </div>

      <Card className="p-4 max-h-96 overflow-y-auto space-y-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Robot className="w-4 h-4 text-primary" />
                )}
              </div>
            </Avatar>

            <div className={`flex-1 space-y-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`
                  inline-block px-3 py-2 rounded-lg text-sm max-w-[85%]
                  ${message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {message.content}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTime(new Date(message.timestamp))}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                <Robot className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </Avatar>
            <div className="flex-1">
              <div className="inline-block px-3 py-2 rounded-lg text-sm bg-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}