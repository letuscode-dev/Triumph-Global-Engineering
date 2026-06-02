"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

const CONSENT_KEY = "tge-cookie-consent";
const CONSENT_EVENT = "tge-consent-change";
type Consent = "accepted" | "declined";

// External store so we can read the client-only consent value without a
// setState-in-effect (compatible with React 19 / Next 16 lint rules).
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot(): Consent | null {
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

function getServerSnapshot(): Consent | null {
  return null;
}

function setConsent(value: Consent) {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function Analytics({ gaId }: { gaId?: string }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const showBanner = consent === null && Boolean(gaId);
  const loadGa = Boolean(gaId) && consent === "accepted";

  return (
    <>
      {loadGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');`}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-4"
        >
          <p className="text-sm text-slate-600">
            We use cookies to understand how visitors use our site and improve your
            experience. See our{" "}
            <a href="/privacy" className="font-medium text-brand-600 underline hover:text-brand-700">
              Privacy Policy
            </a>
            . You can accept or decline analytics cookies.
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <button
              type="button"
              onClick={() => setConsent("declined")}
              className="btn-outline py-2 text-sm"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => setConsent("accepted")}
              className="btn-primary py-2 text-sm"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
