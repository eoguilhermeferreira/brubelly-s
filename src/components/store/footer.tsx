import Image from "next/image";
import Link from "next/link";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { TiktokIcon } from "@/components/icons/tiktok-icon";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { STORE } from "@/config/store";

const HELP_LINKS = [
  { href: "/pedido", label: "Consultar meu pedido" },
  { href: "/produtos", label: "Todos os produtos" },
  { href: "/checkout", label: "Formas de pagamento" },
];

const PAYMENT_ICONS = [
  { src: "/payment-icons/pix.svg", alt: "Pix" },
  { src: "/payment-icons/visa.svg", alt: "Visa" },
  { src: "/payment-icons/mastercard.svg", alt: "Mastercard" },
  { src: "/payment-icons/elo.svg", alt: "Elo" },
  { src: "/payment-icons/hipercard.svg", alt: "Hipercard" },
  { src: "/payment-icons/amex.svg", alt: "American Express" },
  { src: "/payment-icons/boleto.svg", alt: "Boleto" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-pine-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Image
              src={STORE.logo}
              alt={STORE.name}
              width={STORE.logoWidth}
              height={STORE.logoHeight}
              className="h-10 w-auto"
            />
            <p className="mt-3 max-w-xs text-sm text-white/70">{STORE.description}</p>
            <div className="mt-4 flex gap-2">
              <a
                href={STORE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={STORE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={STORE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <TiktokIcon className="size-4" />
              </a>
              <a
                href={`https://wa.me/${STORE.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <WhatsappIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-mint-400">Ajuda</p>
            <ul className="mt-3 flex flex-col gap-2">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-mint-400">Contato</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/75">
              <li>{STORE.contact.email}</li>
              <li>{STORE.contact.whatsappDisplay}</li>
              <li>
                {STORE.address.city} — {STORE.address.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/50">
            Formas de pagamento
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_ICONS.map((icon) => (
              // SVGs estáticos pequenos — <img> simples evita a otimização do
              // next/image (que exige dangerouslyAllowSVG para SVG local).
              // eslint-disable-next-line @next/next/no-img-element
              <img key={icon.src} src={icon.src} alt={icon.alt} className="h-8 w-auto rounded-md" />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 pt-2 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE.name}. Todos os direitos reservados.</p>
          <p>Pagamento processado com segurança via Mercado Pago.</p>
        </div>
      </div>
    </footer>
  );
}
