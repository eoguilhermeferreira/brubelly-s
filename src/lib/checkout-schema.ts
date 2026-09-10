import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(3, "Digite seu nome completo"),
  email: z.email("E-mail inválido"),
  phone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .transform((v) => v.replace(/\D/g, "")),
  cep: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "CEP inválido"),
  street: z.string().trim().min(3, "Endereço obrigatório"),
  number: z.string().trim().min(1, "Número obrigatório"),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(2, "Bairro obrigatório"),
  city: z.string().trim().min(2, "Cidade obrigatória"),
  state: z.string().trim().length(2, "UF inválida"),
  shippingOptionId: z.string().min(1, "Selecione uma opção de frete"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutInput, string>>;
