import type { ReactNode } from "react";

import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { MainContent } from "@/components/store/main-content";
import { WhatsappFloatButton } from "@/components/store/whatsapp-float-button";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
      <WhatsappFloatButton />
    </>
  );
}
