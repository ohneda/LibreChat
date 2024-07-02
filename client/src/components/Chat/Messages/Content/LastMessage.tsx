import type { TMessageProps } from '~/common';
// eslint-disable-next-line import/no-cycle
import Message from '../Message';
import { useEffect, useState } from 'react';
import { TMessage } from 'librechat-data-provider/dist/types';
import MessageParts from '../MessageParts';

export default function LastMessage({
  lastMessage,
  setLastMessage,
  messagesTree,
  currentEditId,
  setCurrentEditId,
}: TMessageProps & { lastMessage: TMessage | null; setLastMessage: (message: TMessage) => void }) {

  // const [lastMessage, setLastMessage] = useState<TMessage | null>(null);

  function getLastChildMessage(message: TMessage) {
    while (message.children && message.children.length > 0) {
      message = message.children[message.children.length - 1];
    }
    return message;
  }

  useEffect(() => {
    if (!(messagesTree && messagesTree?.length)) {
      return;
    }
    const message = messagesTree[messagesTree.length - 1];
    const lastMessage = getLastChildMessage(message);
    if (lastMessage.content && lastMessage.content[0].type === 'text' && lastMessage.content[0].text.value.indexOf('```typescript') >= 0) {
      setLastMessage(lastMessage);
    }
  }, [messagesTree]);

  if (!(messagesTree && messagesTree?.length)) {
    return null;
  }

  const message = messagesTree[messagesTree.length - 1];

  if (!message) {
    return null;
  }

  if (!lastMessage) {
    return null;
  }

  console.log('lastMessage', lastMessage);

  if (lastMessage.content) {
    return (
      <MessageParts
        code={true}
        key={lastMessage.messageId}
        message={lastMessage}
        currentEditId={currentEditId}
        setCurrentEditId={setCurrentEditId}
        siblingIdx={messagesTree.length - 1}
        siblingCount={messagesTree.length}
      />
    );
  }

  return (
    <Message
      key={lastMessage.messageId}
      message={lastMessage}
      currentEditId={currentEditId}
      setCurrentEditId={setCurrentEditId}
      siblingIdx={messagesTree.length - 1}
      siblingCount={messagesTree.length}
    />
  );
}
