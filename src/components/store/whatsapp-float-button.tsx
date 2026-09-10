import { STORE } from "@/config/store";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";

export function WhatsappFloatButton() {
  const message = encodeURIComponent(
    `Oi! Vim do site da ${STORE.name} e queria tirar uma dúvida 💚`,
  );

  return (
    <a
      href={`https://wa.me/${STORE.contact.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-pine-900/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-600 animate-float-slow"
    >
      <WhatsappIcon className="size-7" />
    </a>
  );
}
