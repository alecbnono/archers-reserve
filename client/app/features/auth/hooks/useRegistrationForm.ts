import { useState } from "react";
import { INITIAL_FORM } from "~/features/auth/types/auth.types";
import type { RegisterPayload } from "~/features/auth/types/auth.types";
import type { UserRole } from "~/types/user.types";
import {
  validate,
  allValid,
  errorMessages,
} from "~/features/auth/services/auth.validation";
import { registerUser } from "~/features/auth/services/auth.service";

export function useRegistrationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validationResult = validate(form);
  const errors = submitted
    ? errorMessages(validationResult)
    : { username: "", email: "", password: "" };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "isRemembered") {
      setForm((prev) => ({ ...prev, ["isRemembered"]: !e.target.value }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  }

  function setRole(role: string) {
    setForm((prev) => ({ ...prev, role: role as UserRole }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<boolean> {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    setSuccessMessage("");

    if (!allValid(validationResult)) return false;

    setIsSubmitting(true);

    const payload: RegisterPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    };

    try {
      const result = await registerUser(payload);

      if (result.error) {
        setServerError(result.error);
        setIsSubmitting(false);
        return false;
      }

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setIsSubmitting(false);
      return true;
    } catch {
      setServerError("Network error. Please try again.");
      setIsSubmitting(false);
      return false;
    }
  }

  return {
    form,
    errors,
    serverError,
    isSubmitting,
    successMessage,
    handleChange,
    handleSubmit,
    setRole,
  };
}
