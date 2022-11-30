import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useRedirectWithTimer(url: string, seconds = 5) {
  const [delay, setDelay] = useState(seconds);
  const router = useRouter();

  useEffect(() => {
    if (delay === 0) router.push(url);

    const timer = setTimeout(() => {
      setDelay((prevDelay) => prevDelay - 1);
      if (delay === 1) router.push(url);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [delay, router, url]);

  return { delay };
}
