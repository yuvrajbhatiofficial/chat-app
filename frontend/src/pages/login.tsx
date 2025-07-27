import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      router.push("/"); // go to chat
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700  p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
        <p className="text-sm mt-2 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}