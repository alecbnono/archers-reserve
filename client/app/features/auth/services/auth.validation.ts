import type { RegisterFormValues } from "../types/auth.types";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const DLSU_EMAIL_SUFFIX = "@dlsu.edu.ph";

export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

export function isDlsuEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(DLSU_EMAIL_SUFFIX);
}

export function passwordsMatch(
  password: string,
  confirmPassword: string,
): boolean {
  return password === confirmPassword;
}

export interface ValidationResult {
  username: boolean;
  email: boolean;
  passwordMatch: boolean;
}

export function validate(form: RegisterFormValues): ValidationResult {
  return {
    username: isValidUsername(form.username),
    email: isDlsuEmail(form.email),
    passwordMatch: passwordsMatch(form.password, form.confirmPassword),
  };
}

export function allValid(result: ValidationResult): boolean {
  return Object.values(result).every(Boolean);
}

export function errorMessages(result: ValidationResult) {
  return {
    username: !result.username
      ? "Username must be 3–20 characters and contain only letters, numbers, or _"
      : "",
    email: !result.email ? "Email should end with @dlsu.edu.ph" : "",
    password: !result.passwordMatch ? "Passwords don't match" : "",
  };
}
