import { Portal } from '@/components/portal/Portal';

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <Portal locale={locale} />;
}
