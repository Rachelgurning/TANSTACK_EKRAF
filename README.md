# OnanAI — Pasar Kreatif Samosir

OnanAI adalah prototipe marketplace digital untuk membantu UMKM lokal di sekitar Danau Toba mengenalkan produk, membuat konten promosi dengan bantuan AI, dan terhubung dengan mitra hotel atau tempat wisata.

## Menjalankan proyek

```bash
bun install
cp .env.example .env.local
# Isi environment variables pada .env.local
bun run generate-routes
bun dev
```

Buka `http://localhost:3000`. Antarmuka utama tersedia di beranda, `/products`, `/login`, `/register`, `/dashboard`, `/ai-assistant`, dan `/qr-partners`.

## Environment variables

- `BETTER_AUTH_URL`: `http://localhost:3000` saat pengembangan; ubah menjadi URL Vercel saat produksi.
- `BETTER_AUTH_SECRET`: rahasia acak yang kuat.
- `OPENAI_API_KEY`: kunci API dari OpenAI Platform, hanya disimpan di server.
- `OPENAI_MODEL`: model yang digunakan, bawaan `gpt-4.1-mini`.

Jangan commit `.env.local` atau membagikan kunci rahasia. Langganan ChatGPT tidak otomatis mencakup saldo API.

## Pemeriksaan dan build

```bash
bun run generate-routes
bun run lint
bun run build
```

## Deployment Vercel

1. Unggah proyek ke repositori Git.
2. Impor repositori melalui Vercel dan pertahankan deteksi TanStack Start.
3. Tambahkan variabel environment produksi pada pengaturan Vercel. Jangan mengunggah `.env.local`.
4. Atur `BETTER_AUTH_URL` ke URL HTTPS deployment yang benar dan gunakan `BETTER_AUTH_SECRET` baru.
5. Deploy, lalu uji login, pendaftaran, katalog, detail produk, dasbor, dan halaman AI Studio.

## Catatan prototipe

Struktur TanStack Start dan file starter yang ada tetap dipertahankan. Penyimpanan autentikasi serta produk mengikuti implementasi in-memory dari starter, sehingga data pengguna/sesi dan perubahan katalog tidak dijamin bertahan setelah cold start atau redeploy pada Vercel. Form minat mitra QR juga masih berupa prototipe sisi klien. Sebelum dipakai untuk transaksi nyata, hubungkan penyimpanan persisten, proses pemesanan, dan pengiriman data mitra ke layanan server yang sesuai. Lihat `NOTES.md` untuk daftar perubahan dan batasan.

---

Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
bun install
bun dev
```

# Building For Production

To build this application for production:

```bash
bun run build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`


## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
bun dlx shadcn@latest add button
```


## Setting up Better Auth

1. Generate and set the `BETTER_AUTH_SECRET` environment variable in your `.env.local`:

   ```bash
   bun x @better-auth/cli secret
   ```

2. Visit the [Better Auth documentation](https://www.better-auth.com) to unlock the full potential of authentication in your app.

### Adding a Database (Optional)

Better Auth can work in stateless mode, but to persist user data, add a database:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // ... rest of config
});
```

Then run migrations:

```bash
bun x @better-auth/cli migrate
```


## Deploy to Vercel

1. Push this repo to GitHub, GitLab, or Bitbucket
2. In Vercel, choose **Add New > Project** and import the repo
3. Keep the detected TanStack Start framework settings
4. Add production values from `.env.example` under **Settings > Environment Variables**
5. Deploy

Vercel runs the build script and deploys Nitro's output as Vercel Functions and
static assets. The included `vercel.json` makes framework detection explicit.

Variables prefixed with `VITE_` are included in the browser bundle. Keep secrets
unprefixed so they remain server-only.



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).


# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.


# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).


## OpenAI AI Studio

This project includes an AI Studio at `/ai-assistant` to draft Indonesian product copy for creative-economy products. The API request is made from a TanStack Start server function; the API key is server-only and must never be placed in a `VITE_` variable.

1. Copy `.env.example` to `.env.local`.
2. Set `BETTER_AUTH_URL` and generate `BETTER_AUTH_SECRET` as described above.
3. Set `OPENAI_API_KEY` to an API key from your OpenAI platform account. API usage may incur charges and requires available API billing/credits.
4. Optionally set `OPENAI_MODEL` (defaults to `gpt-4.1-mini`).
5. Run `bun install`, then `bun run generate-routes`, then `bun dev`.
6. Open `http://localhost:3000/ai-assistant`.

The AI Studio creates editable draft copy only; it does not automatically save or publish products. Existing product and user CRUD remain separate. The current app uses in-memory storage, so records reset when the server process restarts or is redeployed. Use a persistent database before production use.
