
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Automatically redirect to the dashboard, as the app is now always "logged in" in dev mode.
  redirect('/dashboard');
  return null; // Return null because redirect throws an exception
}
