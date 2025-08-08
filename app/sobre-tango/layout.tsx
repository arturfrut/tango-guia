import { pagesMetadata } from '@/config/metadata'

export const metadata = pagesMetadata.sobreTango

export default function SobreTangoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
