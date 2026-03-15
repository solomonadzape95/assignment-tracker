import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#grad)" />
        <rect x="16" y="18" width="22" height="28" rx="4" fill="#0b1120" />
        <rect
          x="20"
          y="22"
          width="14"
          height="2.5"
          rx="1.25"
          fill="#e5e7eb"
        />
        <rect
          x="20"
          y="28"
          width="10"
          height="2.5"
          rx="1.25"
          fill="#a5b4fc"
        />
        <rect
          x="20"
          y="34"
          width="12"
          height="2.5"
          rx="1.25"
          fill="#e5e7eb"
        />
        <circle cx="42" cy="26" r="8" fill="#22c55e" />
        <path
          d="M38.8 25.5l2.6 2.5 4.8-4.8"
          fill="none"
          stroke="#022c22"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    {
      ...size,
    },
  );
}

