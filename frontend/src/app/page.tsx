'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { usePlans } from '@/lib/plans';

export default function HomePage() {
  const { plans } = usePlans();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(!!localStorage.getItem('memora_token'));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/85 border-b border-border/40 transition-all duration-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (window.location.hash) {
                  window.history.pushState(null, '', '/');
                }
              }
            }}
            className="flex items-center gap-3 group cursor-pointer"
            title="Return to homepage"
          >
            <Logo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display text-2xl tracking-[0.12em] font-normal text-foreground group-hover:text-primary transition-colors">
              MEMORA
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors sm:block cursor-pointer"
            >
              Pricing
            </a>
            <Link
              href="/booth"
              className="rounded-full bg-foreground px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-background hover:bg-foreground/90 transition-all shadow-sm cursor-pointer"
            >
              Open booth
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-8 md:grid-cols-2 md:pb-28 md:pt-14">
        <div className="animate-rise">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
            Browser photobooth
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-[-0.01em] leading-[0.98] text-foreground">
            THE PHOTOBOOTH
            <br />
            LIVES IN YOUR
            <br />
            <span className="italic font-normal text-primary">GUESTS&apos; POCKETS</span>
          </h1>
          <p className="mt-6 max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed font-light font-sans">
            No hardware to rent, no app to install. Guests scan a QR code, shoot with their own camera and walk away with an editorial, printable strip.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/booth"
              className="rounded-full bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-95 transition-all shadow-md hover:shadow-lg"
            >
              Snap a strip now
            </Link>
            <a
              href="#how"
              className="rounded-full border border-foreground/15 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:bg-foreground/5 transition-all"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
            Free to try · Nothing uploaded · Works on any phone
          </p>
        </div>

        {/* Hero Booth Image with Floating Rotated Strip */}
        <div className="relative">
          <img
            src="/images/hero-booth.jpg"
            alt="Playful humanized party animals posing in a photobooth"
            className="w-full rounded-[36px] object-cover shadow-2xl"
          />
          <div className="animate-slide-strip absolute -bottom-6 -left-4 hidden w-32 rotate-6 rounded-2xl bg-cream p-2.5 shadow-2xl sm:block ring-1 ring-border/40 transition-transform duration-300 hover:rotate-3 hover:scale-105">
            <div className="space-y-2">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-xs">
                <img
                  src="/images/strip-animal-1.jpg"
                  alt="Joyful Golden Retriever in party hat"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-xs">
                <img
                  src="/images/strip-animal-2.jpg"
                  alt="Chic party cat with sunglasses"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-stone-100 shadow-xs">
                <img
                  src="/images/strip-animal-3.jpg"
                  alt="French Bulldog with party crown"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <p className="pb-1 pt-2.5 text-center font-display text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
              Memora
            </p>
          </div>
        </div>
      </section>

      {/* How it Works: FOUR STEPS, ZERO SETUP */}
      <section id="how" className="bg-foreground py-24 text-cream">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Seamless Experience
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.01em]">
              FOUR STEPS, ZERO SETUP
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-cream/5 p-7 border border-cream/10">
              <span className="font-mono text-xs tracking-[0.25em] text-primary">01</span>
              <h3 className="mt-4 font-display text-2xl font-normal tracking-wide text-cream">
                Set up your event
              </h3>
              <p className="mt-2.5 text-sm text-cream/70 font-light leading-relaxed">
                Name it, pick your strip layout, frame colour and countdown. Takes about a minute.
              </p>
            </div>
            <div className="rounded-3xl bg-cream/5 p-7 border border-cream/10">
              <span className="font-mono text-xs tracking-[0.25em] text-primary">02</span>
              <h3 className="mt-4 font-display text-2xl font-normal tracking-wide text-cream">
                Share the QR code
              </h3>
              <p className="mt-2.5 text-sm text-cream/70 font-light leading-relaxed">
                Print it for the table or drop it on a screen. Guests scan it with the camera they already carry.
              </p>
            </div>
            <div className="rounded-3xl bg-cream/5 p-7 border border-cream/10">
              <span className="font-mono text-xs tracking-[0.25em] text-primary">03</span>
              <h3 className="mt-4 font-display text-2xl font-normal tracking-wide text-cream">
                Everyone snaps
              </h3>
              <p className="mt-2.5 text-sm text-cream/70 font-light leading-relaxed">
                The booth opens in the browser — three, two, one, flash. No app store, no queue, no attendant.
              </p>
            </div>
            <div className="rounded-3xl bg-cream/5 p-7 border border-cream/10">
              <span className="font-mono text-xs tracking-[0.25em] text-primary">04</span>
              <h3 className="mt-4 font-display text-2xl font-normal tracking-wide text-cream">
                Strips go home
              </h3>
              <p className="mt-2.5 text-sm text-cream/70 font-light leading-relaxed">
                Filters, frames and a caption, then a tap to download or share. Photos never leave the device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases: MADE FOR ROOMS FULL OF PEOPLE */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
            Curated Occasions
          </p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.01em]">
            MADE FOR ROOMS FULL OF PEOPLE
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/80 group">
            <div className="overflow-hidden h-48">
              <img
                src="/images/use-wedding.jpg"
                alt="Weddings"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-normal text-foreground">Weddings</h3>
              <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                A strip on every table, no booth in the corner.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/80 group">
            <div className="overflow-hidden h-48">
              <img
                src="/images/use-birthday.jpg"
                alt="Birthdays"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-normal text-foreground">Birthdays</h3>
              <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                Kids and grandparents both figure it out instantly.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/80 group">
            <div className="overflow-hidden h-48">
              <img
                src="/images/use-corporate.jpg"
                alt="Brand events"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-normal text-foreground">Brand events</h3>
              <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                Your logo and colours on every strip shared.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/80 group">
            <div className="overflow-hidden h-48">
              <img
                src="/images/use-graduation.jpg"
                alt="Graduations"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-normal text-foreground">Graduations</h3>
              <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                Caps, gowns and a keepsake in one tap.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/80 group">
            <div className="overflow-hidden h-48">
              <img
                src="/images/use-party.jpg"
                alt="Parties"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-normal text-foreground">Parties</h3>
              <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                Set it up five minutes before the doors open.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/80 group">
            <div className="overflow-hidden h-48">
              <img
                src="/images/use-school.jpg"
                alt="Schools"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-normal text-foreground">Schools</h3>
              <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                Fundraisers and proms with zero rental cost.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="text-center max-w-xl mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
            Transparent Tiers
          </p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.01em]">
            PRICING
          </h2>
          <p className="mt-3 text-base text-muted-foreground font-light">
            Try the booth free. Pay only when you run a real event.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Free Tier */}
          <div className="rounded-3xl p-8 bg-card ring-1 ring-border flex flex-col justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
                {plans.free.eyebrow}
              </p>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight">
                {plans.free.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">
                {plans.free.period}
              </p>
              <ul className="mt-8 space-y-3 text-sm font-light">
                {plans.free.features.map((feat) => (
                  <li key={feat.id} className="flex items-center gap-2.5">
                    <span className="text-primary font-serif text-lg">—</span>
                    <span className="text-muted-foreground">{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/booth"
              className="mt-9 block rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-border hover:bg-muted/50 transition-colors"
            >
              Try the booth
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl p-8 bg-foreground text-cream shadow-2xl flex flex-col justify-between relative border border-primary/20">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                  {plans.pro.eyebrow}
                </p>
                <span className="rounded-full bg-primary/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                  {plans.pro.badge}
                </span>
              </div>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-cream">
                {plans.pro.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">
                {plans.pro.period}
              </p>
              <ul className="mt-8 space-y-3 text-sm font-light">
                {plans.pro.features.map((feat) => (
                  <li key={feat.id} className="flex items-center gap-2.5">
                    <span className="text-primary font-serif text-lg">—</span>
                    <span className={feat.highlight ? 'text-cream font-medium' : 'text-cream/90'}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={isLoggedIn ? "/checkout/pro" : "/login?tab=register&redirect=/checkout/pro"}
              className="mt-9 block rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 font-bold"
            >
              START WITH PRO ({plans.pro.priceDisplay})
            </Link>
          </div>

          {/* Studio Tier */}
          <div className="rounded-3xl p-8 bg-card ring-1 ring-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
                  {plans.studio.eyebrow}
                </p>
                <span className="rounded-full bg-secondary px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground">
                  {plans.studio.badge}
                </span>
              </div>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight">
                {plans.studio.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">
                {plans.studio.period}
              </p>
              <ul className="mt-8 space-y-3 text-sm font-light">
                {plans.studio.features.map((feat) => (
                  <li key={feat.id} className="flex items-center gap-2.5">
                    <span className="text-primary font-serif text-lg">—</span>
                    <span className={feat.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={isLoggedIn ? "/checkout/studio" : "/login?tab=register&redirect=/checkout/studio"}
              className="mt-9 block rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-border hover:bg-muted/50 transition-colors font-bold"
            >
              START STUDIO ({plans.studio.priceDisplay}/mo)
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-[40px] bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl shadow-primary/25">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.01em]">
            YOUR NEXT EVENT NEEDS A STRIP
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base sm:text-lg font-light opacity-90 leading-relaxed font-sans">
            Open the booth on this device and take one right now — it takes about fifteen seconds.
          </p>
          <Link
            href="/booth"
            className="mt-8 inline-block rounded-full bg-cream px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground hover:opacity-95 transition-all shadow-md hover:scale-105"
          >
            Open the booth
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/80 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (window.location.hash) {
                  window.history.pushState(null, '', '/');
                }
              }
            }}
            className="flex items-center gap-3 group cursor-pointer"
            title="Return to homepage"
          >
            <Logo className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display text-xl tracking-[0.12em] font-normal text-foreground group-hover:text-primary transition-colors">
              MEMORA
            </span>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Photos stay on your device
          </p>
        </div>
      </footer>
    </div>
  );
}
