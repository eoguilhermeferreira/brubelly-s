# BruBelly's Boutique

Loja online de roupas e calçados infantis. Next.js 16 + Supabase + Mercado
Pago + Melhor Envio — ver detalhes de arquitetura em [`CLAUDE.md`](./CLAUDE.md).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O projeto já funciona
sem nenhuma credencial configurada — catálogo, pedidos e clientes vêm de
dados de exemplo (`src/lib/mock-data.ts`).

Painel administrativo: [http://localhost:3000/admin](http://localhost:3000/admin)
— login de demonstração: `equipe@brubellys.com.br` / `brubellys2026`.

## Conectando os serviços reais

Copie `.env.example` para `.env.local` e preencha as variáveis conforme
necessário (Supabase, Mercado Pago, Melhor Envio). Veja a seção "Modo mock"
em [`CLAUDE.md`](./CLAUDE.md) para o que muda em cada caso.
