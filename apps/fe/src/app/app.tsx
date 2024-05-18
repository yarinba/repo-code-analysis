import { useAppContext } from './context/use-app-context.hook';
import Login from './login';
import Home from './home';

export function App() {
  const { credentials } = useAppContext();

  if (!credentials) {
    return <Login />;
  }

  return <Home />;
}

export default App;
