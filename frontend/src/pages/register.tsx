import { useState } from "react";
import { useRouter } from "next/router";
import { register } from "@/lib/api";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [username,setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleRegister = async () => {
    const data = await register(username, email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username); // must be after token is set

      router.push("/"); // go to chat
    } else {
      alert("Registration failed: username must be unique or email should be correct ");
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <input
          type="username"
          placeholder="username"
          className="w-full p-2 border mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
          onClick={handleRegister}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Register
        </button>
        <p className="text-sm mt-2 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}