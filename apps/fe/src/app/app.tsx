import { useAppContext } from './context/use-app-context.hook';
import Login from './login';
import Chat from './chat';

export function App() {
  const { credentials } = useAppContext();

  if (!credentials) {
    return <Login />;
  }

  return <Chat />;
}

export default App;
