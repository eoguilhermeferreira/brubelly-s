"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createOrder, getShippingOptions, lookupAddressByCep } from "@/app/(store)/checkout/actions";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutFieldErrors } from "@/lib/checkout-schema";
import { formatCep, formatPrice } from "@/lib/format";
import type { ShippingOption } from "@/lib/shipping";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();

  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState<CheckoutFieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = React.useState<ShippingOption[]>([]);
  const [shippingOptionId, setShippingOptionId] = React.useState<string>("");
  const [loadingCep, setLoadingCep] = React.useState(false);
  const [loadingShipping, setLoadingShipping] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const lines = React.useMemo(
    () => items.map((i) => ({ productId: i.productId, variationValue: i.variationValue, quantity: i.quantity })),
    [items],
  );

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCepBlur() {
    const digits = form.cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setLoadingCep(true);
    const address = await lookupAddressByCep(digits);
    setLoadingCep(false);

    if (address) {
      setForm((prev) => ({ ...prev, ...address }));
    }

    setLoadingShipping(true);
    const options = await getShippingOptions(digits, lines);
    setShippingOptions(options);
    setShippingOptionId(options[0]?.id ?? "");
    setLoadingShipping(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const result = await createOrder({ form, lines, shippingOptionId });

    if (!result.ok) {
      setErrors(result.fieldErrors);
      setFormError(result.formError ?? null);
      setSubmitting(false);
      if (result.formError) toast.error(result.formError);
      return;
    }

    clear();
    router.push(result.redirectUrl);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-pine-900">Sua sacola está vazia</h1>
        <Button asChild>
          <Link href="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  const selectedShipping = shippingOptions.find((o) => o.id === shippingOptionId);
  const totalCents = subtotalCents + (selectedShipping?.priceCents ?? 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-pine-900">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
            <legend className="px-1 font-display font-semibold text-pine-900">Seus dados</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" error={errors.name}>
                <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
              </Field>
              <Field label="E-mail" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
              </Field>
              <Field label="WhatsApp" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(11) 99999-9999" required />
              </Field>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
            <legend className="px-1 font-display font-semibold text-pine-900">Endereço de entrega</legend>
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <Field label="CEP" error={errors.cep}>
                <div className="relative">
                  <Input
                    value={form.cep}
                    onChange={(e) => updateField("cep", formatCep(e.target.value))}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    required
                  />
                  {loadingCep && <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-muted-foreground" />}
                </div>
              </Field>
              <Field label="Rua" error={errors.street}>
                <Input value={form.street} onChange={(e) => updateField("street", e.target.value)} required />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Número" error={errors.number}>
                <Input value={form.number} onChange={(e) => updateField("number", e.target.value)} required />
              </Field>
              <Field label="Complemento">
                <Input value={form.complement} onChange={(e) => updateField("complement", e.target.value)} />
              </Field>
              <Field label="Bairro" error={errors.neighborhood}>
                <Input value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} required />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
              <Field label="Cidade" error={errors.city}>
                <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} required />
              </Field>
              <Field label="UF" error={errors.state}>
                <Input value={form.state} maxLength={2} onChange={(e) => updateField("state", e.target.value.toUpperCase())} required />
              </Field>
            </div>

            {shippingOptions.length > 0 && (
              <div className="mt-1">
                <p className="text-sm font-semibold text-pine-900">Frete</p>
                <div className="mt-2 flex flex-col gap-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-sm has-[:checked]:border-rose-500 has-[:checked]:bg-rose-100/40"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingOptionId === option.id}
                          onChange={() => setShippingOptionId(option.id)}
                        />
                        {option.name} — até {option.estimatedDays} dias úteis
                      </span>
                      <span className="font-semibold">
                        {option.priceCents === 0 ? "Grátis" : formatPrice(option.priceCents)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {loadingShipping && <p className="text-xs text-muted-foreground">Calculando frete...</p>}
          </fieldset>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-white p-5">
          <h2 className="font-display font-semibold text-pine-900">Resumo do pedido</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variationValue}`} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-mint-50">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <span className="font-medium text-pine-900">{item.name}</span>
                  <span className="text-muted-foreground">Qtd. {item.quantity}</span>
                </div>
                <span className="text-sm font-semibold text-pine-900">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frete</span>
              <span>
                {selectedShipping
                  ? selectedShipping.priceCents === 0
                    ? "Grátis"
                    : formatPrice(selectedShipping.priceCents)
                  : "—"}
              </span>
            </div>
            <div className="mt-1 flex justify-between font-display text-base font-bold text-pine-900">
              <span>Total</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
          </div>

          {formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}

          <Button type="submit" size="lg" className="mt-4 w-full" disabled={submitting || !shippingOptionId}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Pagar com Mercado Pago"}
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Você será redirecionado para o ambiente seguro do Mercado Pago.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
