import { useState } from "react";

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

export function useRegistrationForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const errors = {
    username:
      submitted && !usernameRegex.test(form.username)
        ? "Username must be 3–20 characters and contain only letters, numbers, or _"
        : "",
    email:
      submitted && !form.email.endsWith("@dlsu.edu.ph")
        ? "Email should end with @dlsu.edu.ph"
        : "",
    password:
      submitted && form.password !== form.confirmPassword
        ? "Passwords don't match"
        : "",
  };

  return { form, submitted, errors, handleChange, handleSubmit, setSubmitted };
}
