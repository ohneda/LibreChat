import { ContentTypes, TMessage, TMessageContentParts } from 'librechat-data-provider';
import { TMessageProps } from '~/common';
import Markdown from './Markdown';

const Artifacts = ({
  // messageId is used recursively here
  messageId,
  messagesTree,
  currentEditId,
  setCurrentEditId,
}: TMessageProps) => {

  console.log(messagesTree);
  if (!messagesTree || messagesTree.length === 0) {
    return null;
  }

  const getAllContent = (messages: TMessage[]) => {
    let content = [] as TMessageContentParts[][];
    messages.forEach(message => {
      if (message?.content) {
        content.push(message.content);
      }
      if (message?.children && message.children.length > 0) {
        content = content.concat(getAllContent(message.children));
      }
    });
    return content;
  };

  const allContent = getAllContent(messagesTree);
  console.log(allContent);

  const extractTypescriptContent = (contentArray: TMessageContentParts[]) => {
    return contentArray
      .filter(content => content.type === ContentTypes.TEXT)
      .map(content => {
        const match = content.text.value.match(/```typescript([\s\S]*?)```/);
        return match ? '```typescript' + match[1] + '```' : null;
      })
      .filter(Boolean);
  };

  const typescriptContent = extractTypescriptContent(allContent.flat());
  console.log(typescriptContent);

  if (! typescriptContent[typescriptContent.length - 1]) {
    return null;
  }
  return <div><Markdown message={messagesTree[0]} content={typescriptContent[typescriptContent.length -1] || ''}></Markdown></div>;
};

export default Artifacts;