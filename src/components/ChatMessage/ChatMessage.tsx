import { Avatar, Button, Textarea } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useAnimatedText } from '../AnimatedText'

export type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, 'role'> & {
  id: number
  message: string
  role: 'user' | 'assistant'
  disableAnimation?: boolean
  onPromptEdit?: (id: number, prompt: string) => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  message,
  role,
  disableAnimation = false,
  onPromptEdit,
  ...props
}) => {
  const content = useAnimatedText(message, {
    maxTime: 1000,
    disabled: role === 'user' || disableAnimation,
  })

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newPrompt, setNewPrompt] = useState<string>(message)

  const submitEditPrompt = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    onPromptEdit && onPromptEdit(id, newPrompt)
  }

  return (
    <div {...props} className={clsx('', props.className)}>
      <div className="flex flex-row gap-4 items-start">
        <Avatar
          className="flex-shrink-0"
          showFallback
          color={role === 'assistant' ? 'primary' : 'default'}
          name={role === 'assistant' ? 'A' : ''}
          classNames={{
            name: 'text-[16px]',
          }}
        />
        <div className="flex gap-2 flex-grow border border-gray-200 rounded-lg p-4 text-md bg-white shadow-sm mt-[-4px]">
          {isEditing ? (
            <form className="space-y-2 w-full" onSubmit={submitEditPrompt}>
              <Textarea
                size="lg"
                minRows={2}
                maxRows={8}
                value={newPrompt}
                variant="faded"
                placeholder="Edit your message"
                classNames={{
                  inputWrapper: 'border-gray-100 hover:border-gray-100',
                }}
                onValueChange={(value) => setNewPrompt(value)}
              />

              <div className="flex justify-end">
                <div className="space-x-2">
                  <Button color="primary" size="md" type="submit">
                    Send
                  </Button>
                  <Button
                    size="md"
                    onClick={() => {
                      setIsEditing(false)
                      setNewPrompt(message)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {role === 'user' && (
                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={() => setIsEditing(true)}
                >
                  edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
