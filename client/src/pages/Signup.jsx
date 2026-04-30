import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { display_name: form.name } },
    });
    if (authError) return setError(authError.message);
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <span className="login-brand">// BUCKETLIST</span>
        <div className="login-watermark">99</div>
        <h1 className="login-headline">START<br />YOUR<br />JOURNEY</h1>
      </div>

      <div className="login-form-panel">
        <h2>SIGN UP</h2>
        <p className="login-sub">//create your account</p>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          <label>Confirm Password</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">CREATE ACCOUNT</button>
        </form>
        <div className="login-divider" />
        <p className="login-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
