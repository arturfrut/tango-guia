import { pagesMetadata } from '@/config/metadata';

export const metadata = pagesMetadata.semillero;

export default function SemilleroLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
