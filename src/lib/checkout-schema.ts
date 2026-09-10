import { z } from "zod";

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(3, "Digite seu nome completo"),
    email: z.email("E-mail inválido"),
    phone: z
      .string()
      .trim()
      .min(10, "Telefone inválido")
      .transform((v) => v.replace(/\D/g, "")),
    deliveryMethod: z.enum(["entrega", "retirada"]),
    cep: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .optional()
      .default(""),
    street: z.string().trim().optional().default(""),
    number: z.string().trim().optional().default(""),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default(""),
    state: z.string().trim().optional().default(""),
    shippingOptionId: z.string().min(1, "Selecione uma opção de entrega"),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod !== "entrega") return;

    if (data.cep.length !== 8) {
      ctx.addIssue({ code: "custom", path: ["cep"], message: "CEP inválido" });
    }
    if (!data.street) {
      ctx.addIssue({ code: "custom", path: ["street"], message: "Endereço obrigatório" });
    }
    if (!data.number) {
      ctx.addIssue({ code: "custom", path: ["number"], message: "Número obrigatório" });
    }
    if (!data.neighborhood) {
      ctx.addIssue({ code: "custom", path: ["neighborhood"], message: "Bairro obrigatório" });
    }
    if (!data.city) {
      ctx.addIssue({ code: "custom", path: ["city"], message: "Cidade obrigatória" });
    }
    if (data.state.length !== 2) {
      ctx.addIssue({ code: "custom", path: ["state"], message: "UF inválida" });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutInput, string>>;
