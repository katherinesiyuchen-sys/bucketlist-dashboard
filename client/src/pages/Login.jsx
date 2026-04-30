import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.api-ninjas.com/v1/jokeoftheday", {
      headers: { "X-Api-Key": import.meta.env.VITE_API_NINJAS_KEY },
    })
      .then((r) => r.json())
      .then((data) => setJoke(data[0]))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return setError(authError.message);
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <span className="login-brand">// BUCKETLIST</span>
        <div className="login-watermark">99</div>
        <h1 className="login-headline">CHASE<br />YOUR<br />DREAMS</h1>
        {joke && <p className="login-joke">{joke.joke}</p>}
      </div>

      <div className="login-form-panel">
        <h2>LOG IN</h2>
        <p className="login-sub">//enter your information</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">SIGN IN</button>
        </form>
        <div className="login-divider" />
        <p className="login-switch">
          Don&apos;t have an account yet? <Link to="/signup">Sign up</Link>
        </p>
        <div className="login-duck">🦆</div>
      </div>
    </div>
  );
}
