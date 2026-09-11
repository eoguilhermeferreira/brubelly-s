import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { TiktokIcon } from "@/components/icons/tiktok-icon";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { STORE } from "@/config/store";

const INSTITUTIONAL_LINKS = [
  { href: "/produtos", label: "Todos os produtos" },
  { href: "/carrinho", label: "Meu carrinho" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/pedido", label: "Consultar meu pedido" },
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

const NODEX_LOGO_PATH = "/nodex-logo.png";

function hasNodexLogo() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "nodex-logo.png"));
  } catch {
    return false;
  }
}

const fullAddress = `${STORE.address.street}, ${STORE.address.number}, ${STORE.address.city} - ${STORE.address.state}, ${STORE.address.zipCode}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export function Footer() {
  const showNodexCredit = hasNodexLogo();

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
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-mint-400">
              Institucional
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {INSTITUTIONAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-mint-400">
              Atendimento
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/75">
              <li>
                <a
                  href={`https://wa.me/${STORE.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white"
                >
                  <WhatsappIcon className="size-3.5 shrink-0" />
                  WhatsApp {STORE.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STORE.contact.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-white"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {STORE.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 hover:text-white"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    {STORE.address.street}, {STORE.address.number} — {STORE.address.city}/
                    {STORE.address.state}, {STORE.address.zipCode}
                  </span>
                </a>
              </li>
            </ul>

            <p className="mt-5 font-display text-sm font-semibold uppercase tracking-wide text-mint-400">
              Redes sociais
            </p>
            <div className="mt-3 flex gap-2">
              <a
                href={STORE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <InstagramIcon className="size-4" />
              </a>
              {STORE.social.tiktok && (
                <a
                  href={STORE.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <TiktokIcon className="size-4" />
                </a>
              )}
              {STORE.social.facebook && (
                <a
                  href={STORE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <FacebookIcon className="size-4" />
                </a>
              )}
            </div>
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

        <div className="mt-8 flex flex-col items-center gap-1 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <p>
            © {new Date().getFullYear()}, {STORE.name}. É vedada qualquer reprodução total ou
            parcial, nos termos da Lei nº 9.610/98. Todos os direitos reservados.
          </p>
          <p>CNPJ: {STORE.cnpj}</p>
        </div>

        {showNodexCredit && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-white/40">Desenvolvido por</p>
            <a
              href="https://instagram.com/agencynodex"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NODEX_LOGO_PATH} alt="Agência Nodex" className="h-16 w-auto" />
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
