'use client';

import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../../../public/logo1.svg';
import { formValidationTenant, Tenant } from '../../../../../utils/validation';

const createTenant = gql`
  mutation CreateTenant(
    $username: String!
    $password: String!
    $userId: ID
    $apartmentId: ID
    $avatar: String!
    $since: String
  ) {
    createTenant(
      username: $username
      password: $password
      userId: $userId
      apartmentId: $apartmentId
      avatar: $avatar
      since: $since
    ) {
      id
      username
      avatar
      since
    }
  }
`;

export default function TenantForm(props: {
  userId: number;
  apartmentId: number;
}) {
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [handleCreateTenant] = useMutation(createTenant, {
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: () => {
      router.replace(`/apartments/${props.apartmentId}`);
      router.refresh();
    },
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      avatar: '',
      since: '',
      userId: props.userId,
      apartmentId: props.apartmentId,
    },
    validate: formValidationTenant,
    onSubmit: async (values: Tenant) => {
      await handleCreateTenant({ variables: { ...values } });
    },
  });

  return (
    <div>
      {/* ----- HEADER ----- */}
      <header className="navbar bg-secondary h-20">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
        <div className="flex-none text-info">
          <Link href={`/apartments/${props.apartmentId}`}>
            Return to Profile
          </Link>
        </div>
      </header>
      {/* ----- CREATE USERNAME  ----- */}
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-2 justify-center items-center h-screen">
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Name</span>
              <input
                placeholder="Name here"
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
          {/* ----- CREATE USER PASSWORD  ----- */}
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Password here"
                className={`input input-bordered input-md ${
                  formik.errors.password ? 'border-error' : ''
                }`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>
            {formik.touched.password && formik.errors.password ? (
              <div className="whitespace-pre-line	text-error text-xs mt-2 ml-4">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          {/* ----- CREATE USER AVATAR  ----- */}
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Avatar</span>
              <input
                placeholder="Avatar here"
                name="avatar"
                className="input input-bordered input-md"
                value={formik.values.avatar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>
          </div>
          {/* ----- CREATE USER SINCE ----- */}
          <div className="form-control">
            <label className="input-group input-group-md">
              <span className="w-28">Since</span>
              <input
                placeholder="Tenant since"
                name="since"
                className="input input-bordered input-md"
                value={formik.values.since}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>
          </div>
          <div className="error">{onError}</div>
          {/* ----- CREATE BUTTON ----- */}
          <button className="btn btn-primary">Create Tenant</button>
        </div>
      </form>
    </div>
  );
}
