export async function register(username: string, email: string, password: string) {
    const res = await fetch("http://localhost:5001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return await res.json();
  }
  
  export async function login(email: string, password: string) {
    const res = await fetch("http://localhost:5001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  }
  