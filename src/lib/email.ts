import "server-only";

import { Resend } from "resend";

import { STORE } from "@/config/store";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types/database.types";

/**
 * E-mails transacionais do ciclo de vida do pedido, via Resend.
 *
 * Sem `RESEND_API_KEY` configurado, os envios são pulados (só um aviso no
 * console) — nunca lançam erro, pra não travar checkout, webhook ou
 * atualização de status no admin por causa de um e-mail que falhou.
 */

const DEFAULT_FROM = `${STORE.name} <pedidos@brubellysboutiqueinfantil.com.br>`;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export type OrderEmailItem = {
  productName: string;
  variationLabel: string | null;
  unitPriceCents: number;
  quantity: number;
};

export type OrderEmailData = {
  code: string;
  customerName: string;
  customerEmail: string;
  deliveryMethod: "entrega" | "retirada";
  items: OrderEmailItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(fullName: string): string {
  return fullName.trim().split(" ")[0] || fullName;
}

/** Monta os dados de e-mail a partir de um pedido já carregado do banco (com itens). */
export function orderToEmailData(order: Order): OrderEmailData {
  return {
    code: order.code,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    deliveryMethod: order.delivery_method,
    items: order.items.map((item) => ({
      productName: item.product_name,
      variationLabel: item.variation_label,
      unitPriceCents: item.unit_price_cents,
      quantity: item.quantity,
    })),
    subtotalCents: order.subtotal_cents,
    shippingCents: order.shipping_cents,
    totalCents: order.total_cents,
  };
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn(`[email] RESEND_API_KEY não configurado — pulando envio de "${subject}" para ${to}.`);
    return;
  }

  try {
    const { error } = await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
      to,
      subject,
      html,
    });
    if (error) {
      console.error(`[email] Falha ao enviar "${subject}" para ${to}:`, error);
    }
  } catch (err) {
    console.error(`[email] Erro inesperado ao enviar "${subject}" para ${to}:`, err);
  }
}

// --- Layout compartilhado ---------------------------------------------

function itemsTableHtml(items: OrderEmailItem[]): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece4;font-size:14px;color:#16281d;">
            <strong>${escapeHtml(item.productName)}</strong>
            ${item.variationLabel ? `<br/><span style="color:#7a7168;font-size:12px;">${escapeHtml(item.variationLabel)}</span>` : ""}
            <br/><span style="color:#7a7168;font-size:12px;">Qtd. ${item.quantity}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece4;font-size:14px;color:#16281d;text-align:right;white-space:nowrap;">
            ${formatPrice(item.unitPriceCents * item.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" style="border-collapse:collapse;margin-top:12px;">${rows}</table>`;
}

function totalsHtml(data: OrderEmailData): string {
  return `
    <table role="presentation" width="100%" style="margin-top:14px;font-size:14px;">
      <tr>
        <td style="color:#7a7168;padding:2px 0;">Subtotal</td>
        <td style="text-align:right;padding:2px 0;color:#16281d;">${formatPrice(data.subtotalCents)}</td>
      </tr>
      <tr>
        <td style="color:#7a7168;padding:2px 0;">${data.deliveryMethod === "retirada" ? "Retirada" : "Frete"}</td>
        <td style="text-align:right;padding:2px 0;color:#16281d;">
          ${data.shippingCents === 0 ? "Grátis" : formatPrice(data.shippingCents)}
        </td>
      </tr>
      <tr>
        <td style="font-weight:700;padding-top:10px;border-top:1px solid #f0ece4;color:#16281d;">Total</td>
        <td style="text-align:right;font-weight:700;padding-top:10px;border-top:1px solid #f0ece4;color:#16281d;">
          ${formatPrice(data.totalCents)}
        </td>
      </tr>
    </table>`;
}

function orderSummaryHtml(data: OrderEmailData): string {
  return `${itemsTableHtml(data.items)}${totalsHtml(data)}`;
}

function emailLayout(params: { preheader: string; heading: string; bodyHtml: string }): string {
  const logoUrl = `${STORE.url}${STORE.logo}`;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(params.heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:#eef7f0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;font-size:1px;color:#eef7f0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${escapeHtml(params.preheader)}
    </span>
    <table role="presentation" width="100%" style="background:#eef7f0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5ddd3;">
            <tr>
              <td style="padding:24px 32px;text-align:center;border-bottom:3px solid #e85d82;">
                <img src="${logoUrl}" alt="${escapeHtml(STORE.name)}" width="140" style="display:block;margin:0 auto;height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#16281d;">${escapeHtml(params.heading)}</h1>
                ${params.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#fdf6f0;border-top:1px solid #e5ddd3;text-align:center;font-size:12px;color:#7a7168;">
                <p style="margin:0 0 4px;">${escapeHtml(STORE.name)} — ${escapeHtml(STORE.address.street)}, ${escapeHtml(STORE.address.number)}, ${escapeHtml(STORE.address.city)}/${escapeHtml(STORE.address.state)}</p>
                <p style="margin:0;">WhatsApp: ${escapeHtml(STORE.contact.whatsappDisplay)} · <a href="${STORE.url}" style="color:#d43f68;text-decoration:none;">${STORE.url.replace(/^https?:\/\//, "")}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function greeting(data: OrderEmailData): string {
  return `<p style="margin:0 0 4px;font-size:15px;color:#16281d;">Oi, ${escapeHtml(firstName(data.customerName))}!</p>`;
}

function trackOrderNote(data: OrderEmailData): string {
  return `<p style="margin:20px 0 0;font-size:12px;color:#7a7168;">
    Acompanhe seu pedido a qualquer momento em <a href="${STORE.url}/pedido" style="color:#d43f68;">${STORE.url.replace(/^https?:\/\//, "")}/pedido</a>,
    usando o número <strong>${escapeHtml(data.code)}</strong> e o e-mail usado na compra.
  </p>`;
}

// --- 1. Pedido recebido --------------------------------------------------

export async function sendOrderReceivedEmail(data: OrderEmailData): Promise<void> {
  const html = emailLayout({
    preheader: `Recebemos seu pedido ${data.code} — pagamento ainda pendente.`,
    heading: "Recebemos seu pedido!",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Seu pedido <strong>${escapeHtml(data.code)}</strong> chegou até nós e já está na fila. Assim que o
        pagamento for confirmado, começamos a preparar tudo com carinho.
      </p>
      <p style="margin:12px 0 0;font-size:14px;color:#7a7168;">Pagamento: <strong style="color:#c2842a;">pendente</strong></p>
      ${orderSummaryHtml(data)}
      ${trackOrderNote(data)}
    `,
  });

  await sendEmail(data.customerEmail, `Recebemos seu pedido ${data.code}!`, html);
}

// --- 2. Pagamento aprovado/recusado/reembolsado --------------------------

export async function sendPaymentApprovedEmail(data: OrderEmailData): Promise<void> {
  const html = emailLayout({
    preheader: `Pagamento do pedido ${data.code} aprovado — já vamos preparar tudo.`,
    heading: "Pagamento aprovado!",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Boas notícias! Confirmamos o pagamento do seu pedido <strong>${escapeHtml(data.code)}</strong> e já vamos
        começar a separar e preparar tudo com carinho.
      </p>
      ${orderSummaryHtml(data)}
      ${trackOrderNote(data)}
    `,
  });

  await sendEmail(data.customerEmail, `Pagamento aprovado — pedido ${data.code}`, html);
}

export async function sendPaymentRejectedEmail(data: OrderEmailData): Promise<void> {
  const whatsappUrl = `https://wa.me/${STORE.contact.whatsapp}?text=${encodeURIComponent(
    `Oi! Meu pagamento do pedido ${data.code} não foi aprovado, pode me ajudar?`,
  )}`;

  const html = emailLayout({
    preheader: `Não conseguimos aprovar o pagamento do pedido ${data.code}.`,
    heading: "Pagamento não aprovado",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Não conseguimos aprovar o pagamento do seu pedido <strong>${escapeHtml(data.code)}</strong>. Isso pode
        acontecer por diversos motivos — dados do cartão, limite disponível, etc.
      </p>
      <p style="margin:12px 0 0;font-size:15px;color:#16281d;">
        Você pode tentar fazer o pedido novamente pelo site, ou chamar a gente no WhatsApp que ajudamos a resolver.
      </p>
      <table role="presentation" style="margin-top:20px;">
        <tr>
          <td style="border-radius:999px;background:#25D366;">
            <a href="${whatsappUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
              Chamar no WhatsApp
            </a>
          </td>
        </tr>
      </table>
      ${orderSummaryHtml(data)}
    `,
  });

  await sendEmail(data.customerEmail, `Não conseguimos aprovar o pagamento — pedido ${data.code}`, html);
}

export async function sendPaymentRefundedEmail(data: OrderEmailData): Promise<void> {
  const html = emailLayout({
    preheader: `O pagamento do pedido ${data.code} foi reembolsado.`,
    heading: "Pedido reembolsado",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        O pagamento do seu pedido <strong>${escapeHtml(data.code)}</strong> foi reembolsado. O valor deve
        aparecer no seu extrato em alguns dias úteis, conforme o prazo do seu banco ou operadora de cartão.
      </p>
      ${orderSummaryHtml(data)}
    `,
  });

  await sendEmail(data.customerEmail, `Reembolso realizado — pedido ${data.code}`, html);
}

// --- 3. Status de entrega/logística --------------------------------------

export async function sendOrderPreparingEmail(data: OrderEmailData): Promise<void> {
  const html = emailLayout({
    preheader: `Seu pedido ${data.code} está sendo preparado.`,
    heading: "Preparando seu pedido",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Seu pedido <strong>${escapeHtml(data.code)}</strong> está sendo separado e embalado com carinho pela
        nossa equipe.
      </p>
      ${trackOrderNote(data)}
    `,
  });

  await sendEmail(data.customerEmail, `Seu pedido está sendo preparado — ${data.code}`, html);
}

export async function sendOrderShippedEmail(data: OrderEmailData, trackingCode?: string | null): Promise<void> {
  const trackingHtml = trackingCode
    ? `<p style="margin:16px 0 0;font-size:14px;color:#16281d;">
         Código de rastreio: <strong>${
           /^https?:\/\//.test(trackingCode)
             ? `<a href="${escapeHtml(trackingCode)}" style="color:#d43f68;">${escapeHtml(trackingCode)}</a>`
             : escapeHtml(trackingCode)
         }</strong>
       </p>`
    : "";

  const html = emailLayout({
    preheader: `Seu pedido ${data.code} saiu para entrega.`,
    heading: "Pedido enviado!",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Seu pedido <strong>${escapeHtml(data.code)}</strong> já saiu da nossa loja e está a caminho.
      </p>
      ${trackingHtml}
      ${trackOrderNote(data)}
    `,
  });

  await sendEmail(data.customerEmail, `Seu pedido saiu para entrega — ${data.code}`, html);
}

export async function sendOrderDeliveredEmail(data: OrderEmailData): Promise<void> {
  const html = emailLayout({
    preheader: `Seu pedido ${data.code} consta como entregue.`,
    heading: "Pedido entregue!",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Seu pedido <strong>${escapeHtml(data.code)}</strong> consta como entregue. Esperamos que ame cada peça!
      </p>
      <p style="margin:12px 0 0;font-size:15px;color:#16281d;">
        Qualquer coisa, é só chamar a gente no WhatsApp (${escapeHtml(STORE.contact.whatsappDisplay)}).
      </p>
    `,
  });

  await sendEmail(data.customerEmail, `Pedido entregue — ${data.code}`, html);
}

export async function sendOrderCancelledEmail(data: OrderEmailData): Promise<void> {
  const html = emailLayout({
    preheader: `Seu pedido ${data.code} foi cancelado.`,
    heading: "Pedido cancelado",
    bodyHtml: `
      ${greeting(data)}
      <p style="margin:0;font-size:15px;color:#16281d;">
        Seu pedido <strong>${escapeHtml(data.code)}</strong> foi cancelado. Se você não pediu esse cancelamento
        ou tiver qualquer dúvida, chama a gente no WhatsApp (${escapeHtml(STORE.contact.whatsappDisplay)}).
      </p>
    `,
  });

  await sendEmail(data.customerEmail, `Pedido cancelado — ${data.code}`, html);
}
