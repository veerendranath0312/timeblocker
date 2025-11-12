import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Github } from 'lucide-react';

function Navbar() {
  return (
    <nav className="p-3 sm:p-4 border-b">
      <div className="max-w-[1500px] mx-auto flex justify-between items-center px-4 sm:px-0">
        <Link to="/" className="text-xl sm:text-2xl font-bold">
          timeblocker
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="p-3 sm:p-4 border-t text-center">
      <p className="text-xs sm:text-sm px-4">
        Copyright &copy; 2025 Time Blocker | All rights reserved
      </p>
    </footer>
  );
}

function ForgotPasswordForm({ switchToLogin }) {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="w-full sm:w-[512px] h-full bg-(--color-3) p-6 rounded-xl">
      <form className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Forgot password?</h3>
          <button
            className="text-sm font-medium border border-(--text-color) px-3 py-[2px] rounded-full cursor-pointer"
            onClick={switchToLogin}
          >
            Log in
          </button>
        </div>

        <p className="text-base text-(--text-color) text-left mb-6">
          Please enter your email address to receive instructions on how to
          reset your password.
        </p>
        <div className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full pb-2 border-b border-(--color-disabled) text-base outline-none"
            value={email}
            onChange={handleEmailChange}
          />

          <button
            className="w-full bg-black text-white text-base font-bold px-4 py-2 rounded-full"
            style={{
              opacity: email ? 1 : 0.5,
              cursor: email ? 'pointer' : '',
            }}
            disabled={!email}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function LoginForm({ switchToSignup }) {
  const [switchToForgotPassword, setSwitchToForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSwitchToForgotPassword = () => {
    setSwitchToForgotPassword(true);
  };

  return (
    <>
      {switchToForgotPassword ? (
        <ForgotPasswordForm switchToLogin={handleSwitchToForgotPassword} />
      ) : (
        <div className="w-full sm:w-[512px] h-full bg-(--color-3) p-6 rounded-xl">
          <form className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Hello, welcome back!</h3>
              <button
                className="text-sm font-medium border border-(--text-color) px-3 py-[2px] rounded-full cursor-pointer"
                onClick={switchToSignup}
              >
                Sign up
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full pb-2 border-b border-(--color-disabled) text-base outline-none"
                value={email}
                onChange={handleEmailChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full pb-2 border-b border-(--color-disabled) text-base outline-none"
                value={password}
                onChange={handlePasswordChange}
              />

              <p
                onClick={handleSwitchToForgotPassword}
                className="text-base text-(--color-disabled) text-right cursor-pointer hover:text-(--text-color) transition-colors duration-300"
              >
                Forgot password?
              </p>

              <button
                className="w-full bg-black text-white text-base font-bold px-4 py-2 rounded-full"
                style={{
                  opacity: email && password ? 1 : 0.5,
                  cursor: email && password ? 'pointer' : '',
                }}
                disabled={!email || !password}
              >
                Let me in
              </button>
            </div>

            <div className="flex justify-center items-center gap-4 sm:flex-row flex-col ">
              <button className="w-full sm:w-auto text-sm font-normal bg-white text-black border border-(--text-color) py-2 rounded-full cursor-pointer flex justify-center items-center gap-2 flex-1">
                <Mail size={20} /> Sign in with Google
              </button>
              <button className="w-full sm:w-auto text-sm font-normal bg-white text-black border border-(--text-color) py-2 rounded-full cursor-pointer flex justify-center items-center gap-2 flex-1">
                <Github size={20} /> Sign in with GitHub
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function SignupForm({ switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-full sm:w-[512px] h-full bg-(--color-2) p-6 rounded-xl">
      <form className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Hello, welcome back!</h3>
          <button
            className="text-sm font-medium border border-(--text-color) px-3 py-[2px] rounded-full cursor-pointer"
            onClick={switchToLogin}
          >
            Log in
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Name"
            className="w-full pb-2 border-b border-(--color-disabled) text-base outline-none"
            value={name}
            onChange={handleNameChange}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full pb-2 border-b border-(--color-disabled) text-base outline-none"
            value={email}
            onChange={handleEmailChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full pb-2 border-b border-(--color-disabled) text-base outline-none"
            value={password}
            onChange={handlePasswordChange}
          />

          <p className="text-[12px] text-(--color-disabled) text-left">
            By proceeding, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <button
            className="w-full bg-black text-white text-base font-bold px-4 py-2 rounded-full"
            style={{
              opacity: name && email && password ? 1 : 0.5,
              cursor: name && email && password ? 'pointer' : '',
            }}
            disabled={!name || !email || !password}
          >
            Create account
          </button>
        </div>

        <div className="flex justify-center items-center gap-4 sm:flex-row flex-col ">
          <button className="w-full sm:w-auto text-sm font-normal bg-white text-black border border-(--text-color) py-2 rounded-full cursor-pointer flex justify-center items-center gap-2 flex-1">
            <Mail size={20} /> Sign in with Google
          </button>
          <button className="w-full sm:w-auto text-sm font-normal bg-white text-black border border-(--text-color) py-2 rounded-full cursor-pointer flex justify-center items-center gap-2 flex-1">
            <Github size={20} /> Sign in with GitHub
          </button>
        </div>
      </form>
    </div>
  );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-[1500px] flex-1 flex flex-col items-center justify-center gap-4 sm:gap-5 px-4 sm:px-6 py-6 sm:py-8">
        {isLogin ? (
          <LoginForm switchToSignup={switchToSignup} />
        ) : (
          <SignupForm switchToLogin={switchToLogin} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AuthPage;
