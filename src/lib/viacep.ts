export type ViaCepAddress = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export async function lookupCep(cep: string): Promise<ViaCepAddress | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const data: ViaCepAddress = await response.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}
