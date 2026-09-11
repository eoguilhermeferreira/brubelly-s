import type { SVGProps } from "react";

/** Ícone de vestido — não existe um pronto no lucide-react, feito no mesmo estilo (stroke, 24x24). */
export function DressIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M8 4 Q12 7 16 4 L17 10 L15 15 L19 21 L5 21 L9 15 L7 10 Z" />
    </svg>
  );
}
