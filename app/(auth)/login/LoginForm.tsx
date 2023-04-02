'use client';

import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../public/logo1.svg';
import { Login, loginValidation } from '../../../utils/validation';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      avatar
    }
  }
`;

export default function LoginForm() {
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [loginHandler] = useMutation(loginMutation, {
    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      router.refresh();
    },
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: loginValidation,
    onSubmit: async (values: Login) => {
      await loginHandler({ variables: { ...values } });
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
      {/* ----- LOGIN FORM ----- */}
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 justify-content items-center h-screen mt-16">
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Name</span>
              <input
                placeholder="Please enter username"
                name="username"
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
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Password</span>
              <input
                type="password"
                placeholder="Please enter password"
                name="password"
                className={`input input-bordered input-md ${
                  formik.errors.password ? 'border-error' : ''
                }`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-error text-xs mt-2 ml-4 whitespace-pre-line">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className="error">{onError}</div>
          <button className="btn btn-primary">Login</button>
          <div>
            <Link href="/tenantLogin">Login as Tenant?</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
