import { redirect } from 'next/navigation';

export default function BookingPage() {
  // Redirect to step 1 by default
  redirect('/booking/step1');
}