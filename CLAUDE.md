# BruBelly's Boutique — instruções do projeto

E-commerce de roupas e calçados infantis. Stack: Next.js 16 (App Router,
Turbopack), React 19, TypeScript, Tailwind CSS v4, componentes shadcn/ui
escritos à mão (ver "Sobre o shadcn/ui" abaixo), Supabase (Postgres + Auth),
Mercado Pago (Checkout Pro), Melhor Envio (cotação de frete), Vercel (deploy).

Sem login de cliente: checkout é 100% guest, com consulta pública de pedido
por número + e-mail. Só existe login para a equipe da loja, protegendo o
painel `/admin`.

## Modo mock (estado atual)

O projeto roda hoje **sem nenhuma credencial configurada**. Toda a leitura de
dados passa por `src/lib/queries.ts`, que atualmente devolve os dados de
`src/lib/mock-data.ts`. Quando as variáveis de ambiente do Supabase forem
preenchidas (`.env.example`), troque o corpo de cada função de
`lib/queries.ts` por uma consulta real via `createPublicClient()`
(`src/lib/supabase/public.ts`) — as assinaturas já foram desenhadas para
isso, nenhuma página precisa mudar.

Outras peças que hoje rodam em modo demonstração e têm um caminho claro para
virar "de verdade":

- **Autenticação do admin** (`src/lib/auth.ts`): cookie httpOnly simples,
  credenciais em `ADMIN_DEMO_EMAIL`/`ADMIN_DEMO_PASSWORD`. Trocar por
  Supabase Auth + tabela `admin_profiles` antes de produção.
- **Checkout** (`src/app/(store)/checkout/actions.ts`): sem
  `MERCADOPAGO_ACCESS_TOKEN`, pula o pagamento real e redireciona direto
  para `/checkout/sucesso` — não há persistência em banco, então pedidos
  criados no checkout não aparecem depois em "Meu pedido" (só os pedidos
  seed de `mock-data.ts`, ex. `BB00001` / e-mail `marina.souza@email.com`).
- **Frete** (`src/lib/melhor-envio.ts`): sem `MELHOR_ENVIO_TOKEN`, cai no
  frete fixo (`src/lib/shipping.ts`).
- **CEP** (`src/lib/viacep.ts`): já é uma API pública real (ViaCEP), funciona
  mesmo em modo mock.
- **Admin > Pedidos**: mudar o status de um pedido edita o array em memória
  de `mock-data.ts` — funciona durante a sessão do servidor, mas não
  persiste entre deploys/restarts.
- **Admin > Produtos/Categorias/Banners**: somente leitura no modo mock.

## Schema do banco (para quando o Supabase for conectado)

Ver `supabase/migrations/0001_init.sql`. Tabelas: `categories` (com
`parent_id`), `products`, `product_images`, `product_variations` (tamanho +
estoque próprio), `banners`, `customers`, `orders` (endereço em JSON), `order_items`,
`admin_profiles`. Os tipos manuais em `src/types/database.types.ts` espelham
esse schema — troque pelo gerado via `supabase gen types typescript` assim
que o projeto Supabase existir.

## Padrões importantes

- **Preço e frete sempre recalculados no servidor** no momento do checkout —
  `checkout/actions.ts` nunca confia no valor mostrado no carrinho do
  navegador, sempre busca o preço canônico do produto.
- **Webhook do Mercado Pago** (`src/app/api/webhooks/mercadopago/route.ts`)
  sempre busca o pagamento real na API pelo id notificado antes de
  atualizar qualquer status — nunca confia no payload da notificação em si.
- **Checkout Pro** (redirect), não Checkout Transparente.
- Middleware de admin fica em `src/proxy.ts`, reexportado por
  `src/middleware.ts` (nome exigido pelo Next.js).

## Sobre o shadcn/ui

Os componentes em `src/components/ui/` foram escritos à mão (não via
`shadcn add`) porque o registro `ui.shadcn.com` está bloqueado pela política
de rede deste ambiente. Seguem o padrão clássico (Radix + CVA), com os
tokens de tema em `src/app/globals.css`. `components.json` documenta a
configuração para quando o CLI puder ser usado normalmente.

## Design

Paleta: verde-menta + rosa-framboesa + algodão (branco quente) — ver tokens
nomeados em `globals.css`. Tipografia: Bricolage Grotesque (display) + Plus
Jakarta Sans (corpo). Elemento-assinatura: cards de produto e chips de
categoria em formato de **etiqueta de roupa** (classe `.tag-shape` +
`.tag-hole` em `globals.css`).
