# Viexon

Repositorio reiniciado do zero com:

- automacao do Vercel preservada no painel
- integracao do Supabase com GitHub preservada
- estrutura `supabase/` mantida para migrations
- base minima de Next.js pronta para desenvolvimento

## Comecar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Ambiente

Preencha `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Banco

Arquivos do banco ficam em `supabase/`.

Com Docker instalado, o fluxo local fica:

```bash
npx supabase start
npx supabase db reset
```
