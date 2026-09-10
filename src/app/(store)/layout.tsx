import type { ReactNode } from "react";

import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { WhatsappFloatButton } from "@/components/store/whatsapp-float-button";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFloatButton />
    </>
  );
}
