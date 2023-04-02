'use client';

import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../public/logo1.svg';
import {
  formValidation,
  getSafeReturnToPath,
  Values,
} from '../../../utils/validation';

export type UserResponse = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

const createUser = gql`
  mutation createUser($username: String!, $password: String!, $avatar: String) {
    createUser(username: $username, password: $password, avatar: $avatar) {
      id
      username
      avatar
    }
  }
`;

export default function RegistrationForm(props: {
  returnTo?: string | string[];
}) {
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [handleCreateUser] = useMutation(createUser, {
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: () => {
      const returnTo = getSafeReturnToPath(props.returnTo);
      if (returnTo) {
        router.push(returnTo);
        return;
      }
      router.replace(`/login`);
      router.refresh();
    },
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      avatar: '',
    },
    validate: formValidation,
    onSubmit: async (values: Values) => {
      await handleCreateUser({ variables: { ...values } });
    },
  });

  return (
    <div>
      {/* ----- HEADER ----- */}
      <header className="navbar bg-primary-focus">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
      </header>
      {/* ----- CREATE USER NAME ----- */}
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 justify-content items-center h-screen mt-16">
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Name</span>
              <input
                placeholder="Please enter username"
                name="username"
                autoComplete="username"
                className={`input input-bordered input-md ${
                  formik.errors.username ? 'border-error' : ''
                }`}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.username && formik.errors.username ? (
              <div className="text-error text-xs mt-2 ml-4 whitespace-pre-line">
                {formik.errors.username}
              </div>
            ) : null}
          </div>
          {/* ----- CREATE USER PASSWORD ----- */}
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Password</span>
              <input
                type="password"
                placeholder="Please enter password"
                name="password"
                autoComplete="current-password"
                className={`input input-bordered input-md ${
                  formik.errors.password ? 'border-error' : ''
                }`}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </label>
            {formik.touched.password && formik.errors.password ? (
              <div className="whitespace-pre-line	text-error text-xs mt-2 ml-4">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          {/* ----- CREATE USER AVATAR ----- */}
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Avatar</span>
              <input
                placeholder="Upload Avatar here"
                name="avatar"
                className="input input-bordered input-md"
                value={formik.values.avatar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>
          </div>
          <p>{onError}</p>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
