
import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(
        `http://localhost:5001/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isLogin
              ? { email, password }
              : { name, email, password }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setLoggedInUser(data.user);
        setIsLoggedIn(true);
        setMessage("");
      } else {
        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedInUser(null);
    setIsLoggedIn(false);
    setIsLogin(true);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
  };

  // Dashboard after login
  if (isLoggedIn && loggedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-indigo-700">
              SecureAuth
            </h1>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg sm:p-10">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
              {(loggedInUser.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Dashboard
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Welcome, {loggedInUser.name}!
            </h2>

            <p className="mt-3 text-gray-600">
              You have successfully logged in to your account.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                ✓
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Authentication
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                You are logged in successfully.
              </p>

              <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Active
              </span>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                👤
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Your Profile
              </h3>

              <p className="mt-2 break-words text-sm text-gray-600">
                {loggedInUser.email}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🔒
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Security
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Your password is securely hashed on the server.
              </p>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            SecureAuth Authentication System
          </p>
        </main>
      </div>
    );
  }

  // Login and Register page
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg">
            S
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            SecureAuth
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isLogin
              ? "Welcome back! Please log in to your account."
              : "Create your account to get started."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
            className={`rounded-lg py-2.5 text-sm font-semibold transition ${
              isLogin
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
            className={`rounded-lg py-2.5 text-sm font-semibold transition ${
              !isLogin
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Password must be at least 6 characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login to Account"
                : "Create Account"}
          </button>
        </form>

        {message && (
          <div
            role="status"
            className="mt-5 break-words rounded-lg bg-indigo-50 p-3 text-center text-sm text-indigo-800"
          >
            {message}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-500">
          Protected with secure authentication
        </p>
      </div>
    </div>
  );
}

export default App;

