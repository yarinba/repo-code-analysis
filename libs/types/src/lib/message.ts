export type TMessage = {
  id: string;
  text: string;
  actor: 'user' | 'ai';
  predefinedPromptId?: number;
};
