'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../../../../../public/logo1.svg';

export type ApartmentResponse = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

const createStatistic = gql`
  mutation CreateStats(
    $userId: ID
    $apartmentId: ID
    $rent: Int
    $mortgage: Int
    $expense: Int
    $month: String
    $year: String
  ) {
    createStat(
      userId: $userId
      apartmentId: $apartmentId
      rent: $rent
      mortgage: $mortgage
      expense: $expense
      month: $month
      year: $year
    ) {
      id
      rent
      mortgage
      expense
      month
      year
    }
  }
`;

export default function StatisticsForm(props: {
  userId: number;
  apartmentId: number;
}) {
  const [rent, setRent] = useState('');
  const [mortgage, setMortgage] = useState('');
  const [expense, setExpense] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [onError, setOnError] = useState('');

  const [handleCreateStats] = useMutation(createStatistic, {
    variables: {
      userId: props.userId,
      apartmentId: props.apartmentId,
      rent: parseInt(rent),
      mortgage: parseInt(mortgage),
      expense: parseInt(expense),
      month,
      year,
    },
    onError: (error) => {
      setOnError(error.message);
    },
  });

  return (
    <div>
      {/* Header */}
      <header className="navbar bg-secondary h-20">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
        <div className="flex-none text-info">
          <Link href={`/profile/${props.userId}`}>Return to Profile</Link>
        </div>
      </header>
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        {/* ----- Create Apartment Rental  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Rent</span>
            <input
              // type="number"
              placeholder="Rent here"
              className="input input-bordered input-md"
              value={rent}
              onChange={(event) => {
                setRent(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Mortgage  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Mortgage</span>
            <input
              // type="number"
              placeholder="Mortgage here"
              className="input input-bordered input-md"
              value={mortgage}
              onChange={(event) => {
                setMortgage(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Expense  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Expenses</span>
            <input
              // type="number"
              placeholder="Expense here"
              className="input input-bordered input-md"
              value={expense}
              onChange={(event) => {
                setExpense(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Month ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Month</span>
            <input
              // type="text"
              placeholder="Month here"
              className="input input-bordered input-md"
              value={month}
              onChange={(event) => {
                setMonth(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Year ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Year</span>
            <input
              // type="text"
              placeholder="Year here"
              className="input input-bordered input-md"
              value={year}
              onChange={(event) => {
                setYear(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Add Button ----- */}
        <button
          onClick={async () => await handleCreateStats()}
          className="btn btn-primary"
        >
          Update Stats
        </button>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
