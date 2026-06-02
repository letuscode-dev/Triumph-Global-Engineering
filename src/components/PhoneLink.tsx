"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import { useIsMobile } from "@/lib/use-is-mobile";

type Props = {
  phone: string;
  phoneIntl: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick">;

/** tel: on mobile; copies the number on desktop to avoid Windows "Pick an app" dialogs. */
export function PhoneLink({ phone, phoneIntl, className, children, ...rest }: Props) {
  const mobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  if (mobile) {
    return (
      <a href={`tel:+${phoneIntl}`} className={className} {...rest}>
        {children}
      </a>
    );
  }

  async function copyNumber(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `tel:+${phoneIntl}`;
    }
  }

  return (
    <a
      href={`tel:+${phoneIntl}`}
      className={className}
      title={copied ? "Number copied!" : `Copy ${phone} to clipboard`}
      onClick={copyNumber}
      {...rest}
    >
      {children}
      {copied && (
        <span className="sr-only" role="status">
          Phone number copied
        </span>
      )}
    </a>
  );
}
