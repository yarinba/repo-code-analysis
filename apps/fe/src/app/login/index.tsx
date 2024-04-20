import { useState } from 'react';
import { useAppContext } from '../context/use-app-context.hook';

export function Login() {
  const { setCredentials } = useAppContext();

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: should validate as OpenAI API Key
    setCredentials(inputValue);
  };

  return (
    <div className="flex h-screen flex-wrap items-center justify-center">
      <div className="mx-4 w-full max-w-5xl overflow-hidden rounded-lg md:mx-0">
        <div className="md:flex">
          <div className="p-8 md:w-1/2">
            <h2 className="mb-4 text-2xl font-bold">Credentials</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="openai-api-key"
                  className="bold mb-2 block text-sm font-bold text-gray-600"
                >
                  Enter your OpenAI API Key
                </label>
                <input
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  id="openai-api-key"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
                  aria-describedby="openai-api-key-description"
                />
                <p
                  id="openai-api-key-description"
                  className="mt-2 text-sm text-gray-500"
                >
                  You can find your OpenAI API key in your{' '}
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    className="text-blue-500 hover:underline"
                  >
                    OpenAI account settings
                  </a>
                  .
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-slate-50 hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Login
              </button>
            </form>
          </div>
          <div className="border-t border-gray-200/40  p-8 md:w-1/2 md:border-t-0 md:border-l">
            <h2 className="mb-4 text-2xl font-bold">How It Works</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              vestibulum, nisl nec ultricies lacinia, nisl nisl aliquam nisl,
              eget aliquam nisl nisl sit amet nisl. Sed vestibulum, nisl nec
              ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl
              sit amet nisl. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Aliquid sit ut eveniet iste expedita ipsum odit similique
              veritatis quas! Neque expedita eaque blanditiis doloribus amet
              veniam aliquam nisi ullam inventore? Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed vestibulum, nisl nec ultricies
              lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet
              nisl. Sed vestibulum, nisl nec ultricies lacinia, nisl nisl
              aliquam nisl, eget aliquam nisl nisl sit amet nisl. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Aliquid sit ut
              eveniet iste expedita ipsum odit similique veritatis quas! Neque
              expedita eaque blanditiis doloribus amet veniam aliquam nisi ullam
              inventore? Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed vestibulum, nisl nec ultricies lacinia, nisl nisl
              aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed
              vestibulum, nisl nec ultricies lacinia, nisl nisl aliquam nisl,
              eget aliquam nisl nisl sit amet nisl. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Aliquid sit ut eveniet iste expedita
              ipsum odit similique veritatis quas! Neque expedita eaque
              blanditiis doloribus amet veniam aliquam nisi ullam inventore?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
