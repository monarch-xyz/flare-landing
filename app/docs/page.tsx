import { redirect } from 'next/navigation';
import { IRUKA_DOCS_SITE_URL } from '@/lib/iruka-links';

export default function DocsPage() {
  redirect(IRUKA_DOCS_SITE_URL);
}
