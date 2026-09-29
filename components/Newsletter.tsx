"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Pages } from "@/lib/types";

/**
 * The signup form.
 *
 * There is nowhere to send an address yet. No database, no email provider.
 * The form validates in the browser and says plainly that nothing was stored,
 * rather than showing a fake "you're subscribed" confirmation. Wire this to
 * Payload's form collection or an email provider when one exists.
 */
export function Newsletter({ content }: { content: Pages["home"]["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMessage({ text: "That address looks incomplete. Check it and try again.", ok: false });
      return;
    }

    setMessage({ text: `Saved. ${content.note}`, ok: true });
    setEmail("");
  }

  return (
    <section className="border-t border-chrome-line bg-spruce py-[clamp(52px,7vw,100px)] text-chrome-fg">
      <div className="mx-auto grid w-full max-w-[1300px] items-center gap-8 px-[var(--gut)] lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em]">
            {content.headline}
          </h2>
          <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-[1.62] text-chrome-fg-2">
            {content.body}
          </p>
        </div>

        <div>
          <form onSubmit={onSubmit} noValidate className="flex flex-wrap gap-2.5">
            <input
              id="newsletter-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              autoComplete="email"
              className="min-w-[190px] flex-1 rounded-[3px] border border-chrome-line bg-transparent px-4 py-[0.78em] text-chrome-fg outline-none transition-colors placeholder:text-chrome-fg-2 focus:border-blaze"
            />
            <Button type="submit" variant="blaze">
              Join the list
            </Button>
          </form>

          {message && (
            <p
              aria-live="polite"
              className={cn(
                "mt-3 font-mono text-[0.7rem] tracking-[0.06em]",
                message.ok ? "text-lamp" : "text-blaze",
              )}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
