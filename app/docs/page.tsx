import { redirect } from 'next/navigation';
import { MEGABAT_DOCS_SITE_URL } from '@/lib/megabat-links';

export default function DocsPage() {
  redirect(MEGABAT_DOCS_SITE_URL);
}
