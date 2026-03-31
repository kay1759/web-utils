# @kay1759/web-utils

![npm](https://img.shields.io/npm/v/@kay1759/web-utils)
![license](https://img.shields.io/npm/l/@kay1759/web-utils)
![downloads](https://img.shields.io/npm/dm/@kay1759/web-utils)
![types](https://img.shields.io/npm/types/@kay1759/web-utils)

Reusable TypeScript utilities for React apps, providing CSRF handling, Apollo GraphQL helpers, JWT utilities, and React Router-compatible responses.

This library provides lightweight helpers for:

- CSRF token handling
- GraphQL (Apollo Client integration)
- JWT decoding
- HTTP response helpers (React Router compatible)

---

## ✨ Features

- 🔐 CSRF token management with caching and deduplication
- 🔗 Apollo Client integration (auth link + helpers)
- 🪪 JWT decoding and expiration checks
- 🌐 HTTP helpers compatible with React Router v7
- 🧪 Fully tested with Vitest
- 📦 TypeScript-first with full type definitions

---

## 📦 Installation

```bash
npm install @kay1759/web-utils
```

Works with modern React applications using Apollo Client and React Router.

## 🚀 Quick Start

```ts
import {
  configureCsrf,
  createApolloClient,
  queryGraphQL,
} from "@kay1759/web-utils";
import { HttpLink } from "@apollo/client";

configureCsrf({ endpoint: "/csrf" });

const client = createApolloClient(
  new HttpLink({
    uri: "/graphql",
    credentials: "include",
  })
);

// fetch data with CSRF automatically handled
const data = await queryGraphQL(client, QUERY);
```

---

## 🔐 CSRF Client

Configure once, then fetch tokens when needed.

```ts
import { configureCsrf, getCsrfToken } from "@kay1759/web-utils";

configureCsrf({
  endpoint: "/csrf",
});

const token = await getCsrfToken();
```

### Features

- Cached token
- Deduplicated concurrent requests
- Optional forced refresh

```ts
await getCsrfToken(true); // force refresh
```

---

## 🔗 GraphQL (Apollo Client)

### Create Apollo Client with CSRF support (recommended)

Automatically attaches CSRF token to all requests.

```ts
import { createApolloClient } from "@kay1759/web-utils";
import { HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "include",
});

const client = createApolloClient(httpLink);
```

---

### Query helper

```ts
import { queryGraphQL } from "@kay1759/web-utils";

const data = await queryGraphQL(client, QUERY, { id: 1 });
```

---

### Mutation helper

```ts
import { mutateGraphQL } from "@kay1759/web-utils";

const result = await mutateGraphQL(client, MUTATION, {
  name: "Alice",
});
```

---

## 🪪 JWT Utilities

### Decode JWT

```ts
import { decodeJwt } from "@kay1759/web-utils";

const payload = decodeJwt(token);
```

### Check expiration

```ts
import { isExpired } from "@kay1759/web-utils";

if (isExpired(payload)) {
  // token expired
}
```

---

## 🍪 Token Storage (Cookie)

```ts
import { configureAuthToken, setToken, getToken } from "@kay1759/web-utils";

configureAuthToken({
  cookieName: "auth_token",
});

setToken({ token: "my-token" });

const token = getToken();
```

---

## 🌐 HTTP Helpers (React Router v7 compatible)

```ts
import { json, redirect, error } from "@kay1759/web-utils";

return json({ ok: true });

throw redirect("/login");

throw error(404, "Not found");
```

---

## 🧱 Project Structure

```
src/
├── auth/
│   ├── jwt.ts
│   └── token.ts
├── csrf/
│   └── client.ts
├── graphql/
│   ├── authLink.ts
│   ├── client.ts
│   └── execute.ts
├── http/
│   └── response.ts
└── index.ts
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📚 Documentation

Generate API docs with TypeDoc:

```bash
npx typedoc
```

---

## ⚙️ Requirements

- Node.js 18+
- TypeScript 5+
- Apollo Client 4+
- React Router v7 (optional)

---

## 🤝 Contributing

PRs are welcome.

---

## 📄 License

MIT
