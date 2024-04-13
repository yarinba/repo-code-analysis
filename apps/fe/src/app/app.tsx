import { useLocalStorage } from 'usehooks-ts';
import Login from './login';

export function App() {
  const [openAIKey, setOpenAIKey] = useLocalStorage('openai-api-key', '');

  if (!openAIKey) {
    return <Login setCredentials={setOpenAIKey} />;
  }

  return <h1 className="text-3xl font-bold underline ">Hello world!</h1>;
}

export default App;
