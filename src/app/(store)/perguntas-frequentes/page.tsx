import type { Metadata } from "next";
import Link from "next/link";

import { AGE_GROUPS, STORE } from "@/config/store";

export const metadata: Metadata = { title: "Perguntas frequentes" };

const FAQ_ITEMS = [
  {
    question: "Como funciona a entrega?",
    answer: (
      <>
        Entregamos para todo o Brasil — o frete é calculado pelo CEP direto no{" "}
        <Link href="/checkout" className="text-rose-600 underline">
          checkout
        </Link>
        . Se você é de Avaré-SP ou região, também pode escolher{" "}
        <strong>retirar gratuitamente na loja</strong>.
      </>
    ),
  },
  {
    question: "Como funciona a retirada na loja?",
    answer: (
      <>
        No checkout, escolha a opção &quot;Retirar na loja&quot; no lugar de informar
        endereço. Assim que o pagamento for confirmado, chamamos você pelo WhatsApp{" "}
        {STORE.contact.whatsappDisplay} para combinar o melhor dia e horário.
      </>
    ),
  },
  {
    question: "Quais as formas de pagamento?",
    answer: "Cartão de crédito (com parcelamento), Pix e boleto, tudo processado com segurança pelo Mercado Pago.",
  },
  {
    question: "Como acompanho meu pedido?",
    answer: (
      <>
        Na página{" "}
        <Link href="/pedido" className="text-rose-600 underline">
          Consultar meu pedido
        </Link>
        , informando o número do pedido e o e-mail usado na compra — sem precisar de senha
        ou cadastro.
      </>
    ),
  },
  {
    question: "Posso trocar ou devolver um produto?",
    answer:
      "Sim. Pelo Código de Defesa do Consumidor, você tem até 7 dias corridos após o recebimento para desistir da compra sem precisar justificar. Chame a gente no WhatsApp pra combinar a troca ou devolução.",
  },
  {
    question: "Como sei qual tamanho escolher?",
    answer: (
      <>
        Nossas peças são organizadas por faixa etária: {AGE_GROUPS.map((g) => `${g.label} (${g.range})`).join(", ")}
        . Cada produto mostra os tamanhos disponíveis e o estoque de cada um na página do
        produto.
      </>
    ),
  },
  {
    question: "Não encontrei minha dúvida aqui, e agora?",
    answer: (
      <>
        Fala com a gente pelo WhatsApp {STORE.contact.whatsappDisplay} ou pelo e-mail{" "}
        {STORE.contact.email} — respondemos rapidinho!
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-pine-900">Perguntas frequentes</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tudo que você precisa saber antes de comprar na {STORE.shortName}.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} className="rounded-xl border border-border bg-white p-5">
            <p className="font-display font-semibold text-pine-900">{item.question}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-pine-900/80">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
