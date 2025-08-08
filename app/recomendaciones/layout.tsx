import { pagesMetadata } from '@/config/metadata'

export const metadata = pagesMetadata.recomendaciones

export default function RecomendacionesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
