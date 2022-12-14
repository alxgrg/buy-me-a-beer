import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DONATION_IN_CENTS, MAX_DONATION_IN_CENTS } from '../config';
import { Record } from '../types';

export default function Home({ donations }: { donations: Array<Record> }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const presets = [1, 3, 5];

  const activeBtnClasses = 'bg-blue-500 text-white border-blue-500';
  const inactiveBtnClasses =
    'bg-white text-blue-500 border-blue-200 hover:border-blue-500';

  async function handleCheckout() {
    setError(null);
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        message,
        quantity,
      }),
    });

    const res = await response.json();

    if (res.url) {
      const url = res.url;
      router.push(url);
    }

    if (res.error) {
      setError(res.error);
    }
  }

  return (
    <div>
      <Head>
        <title>Buy Me a Beer</title>
        <meta name='description' content='A Buy Me a Coffee Clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col-reverse md:flex-row max-w-3xl m-auto px-4 md:px-0 pt-6'>
        <div className='flex-1 md:mr-8'>
          <h2 className='text-gray-600 font-semibold uppercase mb-4'>
            Recent Donations
          </h2>
          {donations.map((donation) => {
            return (
              <div
                key={donation.id}
                className='p-4 border border-gray-200 rounded-lg mb-2 flex items-center'
              >
                <span className='mr-2'>
                  <Image src='/beer.svg' width='50' height='100' alt='beer' />
                </span>
                <div className='flex flex-col w-full'>
                  <div>
                    <b>{donation.fields.name}</b> donated $
                    {donation.fields.amount}
                  </div>

                  {donation.fields.message &&
                    donation.fields.message.length > 0 && (
                      <div className='bg-blue-100 border border-blue-300 rounded-lg px-2 py-2'>
                        <i>&quot;{donation.fields.message}&quot;</i>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
        <div className='border border-gray-200 rounded-lg py-7 px-6 max-w-sm mx-auto mb-8 md:mb-0'>
          <h1 className='text-2xl text-center font-semibold mb-4'>
            Buy me a beer
          </h1>
          {error && <div>{error}</div>}
          <div className='flex items-center w-full mb-2 border border-blue-300 rounded bg-blue-100 p-6'>
            <span className='mr-2'>
              <Image src='/beer.svg' width='115' height='115' alt='beer' />
            </span>
            <span className='mr-2 font-semibold text-sm text-gray-500'>X</span>
            {presets.map((preset) => {
              return (
                <button
                  className={`font-bold px-4 py-2 rounded-full mr-2 border ${
                    preset === quantity ? activeBtnClasses : inactiveBtnClasses
                  }`}
                  key={preset}
                  onClick={() => setQuantity(preset)}
                >
                  {preset}
                </button>
              );
            })}
            <input
              className='shadow rounded border border-gray-200 p-2'
              type='number'
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              value={quantity}
              min={1}
              max={MAX_DONATION_IN_CENTS / DONATION_IN_CENTS}
            />
          </div>

          <div className='mb-2 w-full'>
            <label className='block' htmlFor='name'>
              Name (Optional)
            </label>
            <input
              className='shadow rounded w-full border border-gray-200 p-2 bg-gray-100 focus:bg-white'
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='John Doe'
            />
          </div>
          <div className='mb-2 w-full'>
            <label className='block' htmlFor='message'>
              Message (Optional)
            </label>
            <textarea
              className='shadow rounded w-full border border-gray-200 p-2 bg-gray-100 focus:bg-white'
              name='message'
              id='message'
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Thank you'
            />
          </div>

          <button
            onClick={handleCheckout}
            className='bg-blue-500 shadow text-white py-3 px-4 rounded-full w-full hover:scale-105 transition'
          >
            <p className='transition-none'>
              Donate ${quantity * (DONATION_IN_CENTS / 100)}
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';

  const response = await fetch(
    `${protocol}://${context.req.headers.host}/api/donations`
  );

  const donations = await response.json();

  return {
    props: {
      donations,
    },
  };
};
