import { z } from 'zod';

const returnToSchema = z.string().refine((value) => {
  return !value.startsWith('/logout') && /^\/[\d#/=?a-z-]+$/.test(value);
});

export function getSafeReturnToPath(path: string | string[] | undefined) {
  const result = returnToSchema.safeParse(path);
  if (!result.success) return undefined;
  return result.data;
}

export interface Values {
  username: string;
  password: string;
  avatar: string;
}

export interface Tenant {
  username: string;
  password: string;
  avatar: string;
  userId: number;
  apartmentId: number;
  since: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface Errors {
  username?: string;
  password?: string;
}

export const formValidation = (values: Values) => {
  const errors: Errors = {};
  if (!values.username) {
    errors.username = 'Please fill out the the username field!';
  } else if (values.username.length > 45 || values.username.length < 6) {
    errors.username = `Username must be between 5 and 45
    characters long.`;
  }

  if (!values.password) {
    errors.password = 'Please provide us with a valid password';
  } else if (
    !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(
      values.password,
    )
  ) {
    errors.password = `Password must be between 8 and 16
    characters long and contain at least one
    number and one special character.`;
  }
  return errors;
};

export const formValidationTenant = (values: Tenant) => {
  const errors: Errors = {};
  if (!values.username) {
    errors.username = 'Please fill out the the username field!';
  } else if (values.username.length > 45 || values.username.length < 6) {
    errors.username = `Username must be between 5 and 45
    characters long.`;
  }

  if (!values.password) {
    errors.password = 'Please provide us with a valid password';
  } else if (
    !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(
      values.password,
    )
  ) {
    errors.password = `Password must be between 8 and 16
    characters long and contain at least one
    number and one special character.`;
  }
  return errors;
};

export const loginValidation = (values: Login) => {
  const errors: Errors = {};
  if (!values.username) {
    errors.username = 'Please fill out the the username field!';
  } else if (values.username.length > 45 || values.username.length < 6) {
    errors.username = `Username must be between 5 and 45
    characters long.`;
  }

  if (!values.password) {
    errors.password = 'Please provide us with a valid password';
  } else if (
    !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(
      values.password,
    )
  ) {
    errors.password = `Password must be between 8 and 16
    characters long and contain at least one
    number and one special character.`;
  }
  return errors;
};
