"use client";
import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, ArrowRight } from "lucide-react";
import { login } from "@/app/admin/actions";
export function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(login, {
    ok: false,
    message: "",
  });
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="login-form">
      <div className="field">
        <label htmlFor="email">Email administrator</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          disabled={!enabled || pending}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Kata sandi</label>
        <div className="password-input">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={200}
            disabled={!enabled || pending}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={
              show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            aria-pressed={show}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {state.message && (
        <p className="form-feedback error" role="alert">
          {state.message}
        </p>
      )}
      <button className="button button-green" disabled={!enabled || pending}>
        {pending ? <LoaderCircle className="spin" size={18} /> : null}
        {pending ? "Memverifikasi…" : "Login"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
