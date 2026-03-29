# @wzs/web-utils

Reusable TypeScript utilities for react.

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

### Create Apollo Client with CSRF support

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
import { queryGraphQL } from "@wzs/kay1759-utils";

const data = await queryGraphQL(client, QUERY, { id: 1 });
```

---

### Mutation helper

```ts
import { mutateGraphQL } from "@wzs/kay1759-utils";

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
  key: "auth_token",
});

setToken("my-token");

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
npm run docs
```

---

## ⚙️ Requirements

- Node.js 18+
- TypeScript 5+
- Apollo Client 4+

---

## 🤝 Contributing

PRs are welcome.

---

## 📄 License

MIT
