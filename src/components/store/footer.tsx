import Link from "next/link";

import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { STORE } from "@/config/store";

const HELP_LINKS = [
  { href: "/pedido", label: "Consultar meu pedido" },
  { href: "/produtos", label: "Todos os produtos" },
  { href: "/checkout", label: "Formas de pagamento" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-pine-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">{STORE.shortName}</p>
            <p className="mt-2 max-w-xs text-sm text-white/70">{STORE.description}</p>
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

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE.name}. Todos os direitos reservados.</p>
          <p>Pagamento processado com segurança via Mercado Pago.</p>
        </div>
      </div>
    </footer>
  );
}
