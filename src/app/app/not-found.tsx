import Link from 'next/link';

import { Button } from '@/components/atom/Button';
import { ArrowAnimated } from '@/components/icons/ArrowAnimated';

import { siteConfig } from '@/app/siteConfig';
import { DatabaseLogo } from '../../../public/DatabaseLogo';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link href={siteConfig.baseLinks.home}>
        <DatabaseLogo className="mt-6 h-10" />
      </Link>
      <p className="mt-6 text-4xl font-semibold text-primary sm:text-5xl">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-text">Page not found</h1>
      <p className="mt-2 text-sm text-text-muted">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button asChild className="group mt-8" variant="light">
        <Link href={siteConfig.baseLinks.home}>
          Go to the home page
          <ArrowAnimated className="stroke-text" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
