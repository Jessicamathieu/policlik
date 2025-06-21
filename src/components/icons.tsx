import type { LucideProps } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>PolicliK</title>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 15V9h2.5a2.5 2.5 0 1 1 0 5H9" />
    </svg>
  ),
};
