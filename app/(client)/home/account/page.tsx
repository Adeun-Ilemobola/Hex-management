'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Info,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const state = useMemo<'success' | 'canceled' | 'unknown'>(() => {
    if (searchParams.get('success') === 'true') return 'success';
    if (searchParams.get('canceled') === 'true') return 'canceled';
    return 'unknown';
  }, [searchParams]);

  const meta = {
    success: {
      icon: CheckCircle2,
      iconClass: 'text-emerald-500',
      title: 'Subscription Active 🎉',
      badge: { label: 'Success', className: 'bg-emerald-100 text-emerald-700' },
      description:
        "Thanks for subscribing! Your payment went through and your account has been upgraded.",
      primaryCta: { label: 'Go to Dashboard', onClick: () => router.push('/home') },
      secondaryCta: { label: 'Manage Billing', onClick: () => router.push('/home/subscription') },
      footer: 'A receipt has been emailed to you.',
    },
    canceled: {
      icon: XCircle,
      iconClass: 'text-rose-500',
      title: 'Checkout Canceled',
      badge: { label: 'Canceled', className: 'bg-rose-100 text-rose-700' },
      description:
        "Looks like you didn’t finish the checkout. No worries—nothing was charged.",
      primaryCta: { label: 'Try Again', onClick: () => router.push('/home/subscription') },
      secondaryCta: { label: 'Back to Account', onClick: () => router.push('/home') },
      footer: 'If you ran into trouble, contact support and we’ll help you out.',
    },
    unknown: {
      icon: Info,
      iconClass: 'text-muted-foreground',
      title: 'Nothing to see here',
      badge: { label: 'Unknown', className: 'bg-muted text-muted-foreground' },
      description:
        'We couldn’t determine the checkout status. If you think this is wrong, please reach out.',
      primaryCta: { label: 'Go Home', onClick: () => router.push('/') },
      secondaryCta: { label: 'Retry Checkout', onClick: () => router.push('/home/subscription') },
      footer: '',
    },
  }[state];

  const Icon = meta.icon;

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-background to-muted/30">
      <Card className="mx-auto w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <Icon className={cn('h-14 w-14', meta.iconClass)} aria-hidden />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>

          <Badge
            className={cn(
              'w-fit mx-auto text-sm font-medium',
              meta.badge.className
            )}
          >
            {meta.badge.label}
          </Badge>
        </CardHeader>

        <CardContent className="text-center text-muted-foreground">
          <p>{meta.description}</p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={meta.primaryCta.onClick}>
            {state === 'canceled' ? <RotateCcw className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            {meta.primaryCta.label}
          </Button>

          <Button variant="outline" className="w-full" onClick={meta.secondaryCta.onClick}>
            {meta.secondaryCta.label}
          </Button>

          {meta.footer && (
            <p className="mt-3 text-xs text-muted-foreground text-center">
              {meta.footer}{' '}
              {state === 'canceled' && (
                <>
                  – <a className="underline" href="mailto:support@yourapp.com">support@yourapp.com</a>
                </>
              )}
            </p>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
