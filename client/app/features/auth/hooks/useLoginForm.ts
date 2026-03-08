import { useState } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { isDlsuEmail } from "~/features/auth/services/auth.validation";
import { loginUser } from "~/features/auth/services/auth.service";

export function useLoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    isRemembered: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const validationResult = isDlsuEmail(form.email);
  const errors = submitted
    ? { email: !validationResult ? "Email should end with @dlsu.edu.ph" : "" }
    : { email: "" };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRememberChange(checked: CheckedState) {
    setForm((prev) => ({ ...prev, isRemembered: checked === true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (!validationResult) return;

    try {
      const result = await loginUser(
        form.email.trim().toLowerCase(),
        form.password,
        form.isRemembered,
      );

      if (result.error) {
        setServerError(result.error);
        return;
      }

      return result.user;
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  return {
    form,
    errors,
    serverError,
    handleChange,
    handleRememberChange,
    handleSubmit,
  };
}
