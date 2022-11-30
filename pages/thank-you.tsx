import useRedirectWithTimer from '../hooks/useRedirectWithTimer';

export default function ThankYou() {
  const { delay } = useRedirectWithTimer('/', 5);
  return (
    <div>
      <p>Thank you for your support. Redirecting home in {delay}...</p>
    </div>
  );
}
