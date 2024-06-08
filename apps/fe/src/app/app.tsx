import Login from './login';
import Home from './home';

import { useCredentials } from './hooks/useCredentials';

export function App() {
  const [credentials] = useCredentials();

  if (!credentials) {
    return <Login />;
  }

  return <Home />;
}

export default App;
