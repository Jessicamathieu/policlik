
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // Le contenu ci-dessous ne sera jamais atteint en raison de la redirection.
  // Il est conservé ici à des fins de référence au cas où la redirection serait supprimée.
  return null;
}
