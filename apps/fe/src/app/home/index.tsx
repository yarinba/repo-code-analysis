import Messages from './messages';
import PromptInput from './prompt-input';
import Suggestions from './suggestions';
import Actions from './actions';

export function Home() {
  return (
    <div className="flex h-full justify-center">
      <div className="container flex h-full flex-col p-5">
        <Actions />
        <Messages />
        <Suggestions />
        <PromptInput />
      </div>
    </div>
  );
}

export default Home;
