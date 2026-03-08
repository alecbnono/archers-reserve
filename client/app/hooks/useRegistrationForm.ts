import { useState } from "react";

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

export function useRegistrationForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isValidUsername = usernameRegex.test(form.username);
  const isValidEmail = form.email.endsWith("@dlsu.edu.ph");
  const isValidPassword = form.password === form.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (isValidUsername && isValidEmail && isValidPassword) {
      // form is valid → proceed with your POST request
    }
  };

  const errors = {
    username:
      submitted && !isValidUsername
        ? "Username must be 3–20 characters and contain only letters, numbers, or _"
        : "",
    email:
      submitted && !isValidEmail ? "Email should end with @dlsu.edu.ph" : "",
    password: submitted && isValidPassword ? "Passwords don't match" : "",
  };

  return { form, submitted, errors, handleChange, handleSubmit, setSubmitted };
}
