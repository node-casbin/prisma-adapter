# Prisma Adapter

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![Build Status][ci-image]][ci-url]
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/S5UjpzGZjN)

[npm-image]: https://img.shields.io/npm/v/casbin-prisma-adapter.svg
[npm-url]: https://npmjs.org/package/casbin-prisma-adapter
[download-image]: https://img.shields.io/npm/dm/casbin-prisma-adapter.svg
[download-url]: https://npmjs.org/package/casbin-prisma-adapter
[ci-image]: https://github.com/node-casbin/prisma-adapter/workflows/ci/badge.svg?branch=master
[ci-url]: https://github.com/node-casbin/prisma-adapter/actions

Prisma Adapter is the [Prisma](https://github.com/prisma/prisma) adapter for [Node-Casbin](https://github.com/casbin/node-casbin). With this library, Node-Casbin can load policy from Prisma supported database or save policy to it.

Based on [Officially Supported Databases](https://www.prisma.io/docs/), the current supported databases are:

- PostgreSQL
- MySQL
- SQLite
- MongoDB

You may find other 3rd-party supported DBs in Prisma website or other places.

## Installation

```
npm install casbin-prisma-adapter --save
```

## Getting Started

### Prisma v7 Setup

This adapter supports Prisma v7. With Prisma v7, the database connection URL is no longer specified in the schema file. Instead, you need to configure it using a `prisma.config.ts` file:

Create a `prisma.config.ts` file in your project root:

```ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasourceUrl: process.env.DATABASE_URL,
});
```

Then set the `DATABASE_URL` environment variable in your `.env` file:

```
DATABASE_URL="mysql://root@localhost:3306/casbin"
```

Alternatively, you can pass a configured PrismaClient instance to the adapter:

```ts
const prisma = new PrismaClient();
const adapter = await PrismaAdapter.newAdapter(prisma);
```

### Schema Configuration

Append the following content to your `schema.prisma`:

```prisma
datasource db {
  provider = "mysql"  // or "postgresql", "sqlite", "mongodb"
}

generator client {
  provider = "prisma-client-js"
}

model CasbinRule {
  id    Int     @id @default(autoincrement())
  ptype String
  v0    String?
  v1    String?
  v2    String?
  v3    String?
  v4    String?
  v5    String?

  @@map("casbin_rule")
}
```

**Note**: With Prisma v7, the `url` property is no longer specified in the datasource block. The connection URL is provided at runtime via the `DATABASE_URL` environment variable.

Create table(MySQL):

```sql
CREATE TABLE IF NOT EXISTS `casbin_rule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ptype` varchar(255) DEFAULT NULL,
  `v0` varchar(255) DEFAULT NULL,
  `v1` varchar(255) DEFAULT NULL,
  `v2` varchar(255) DEFAULT NULL,
  `v3` varchar(255) DEFAULT NULL,
  `v4` varchar(255) DEFAULT NULL,
  `v5` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

Here is a simple example:

```ts
import casbin from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';

async function main() {
  const a = await PrismaAdapter.newAdapter();
  // Or:
  // const prisma = new PrismaClient();
  // const a = await PrismaAdapter.newAdapter(prisma);

  const e = await casbin.newEnforcer('examples/rbac_model.conf', a);

  // Check the permission.
  e.enforce('alice', 'data1', 'read');

  // Modify the policy.
  // await e.addPolicy(...);
  // await e.removePolicy(...);

  // Save the policy back to DB.
  await e.savePolicy();
}

main();
```

## Using Custom Prisma Client Output Path (Prisma v7+)

If you're using a custom output path for your Prisma client (e.g., generating the client to `./src/generated/client`), you must pass your PrismaClient instance to the adapter:

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "./src/generated/client"
}
```

```ts
import casbin from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { PrismaClient } from './src/generated/client'; // Your custom path

async function main() {
  const prisma = new PrismaClient();
  const a = await PrismaAdapter.newAdapter(prisma);

  const e = await casbin.newEnforcer('examples/rbac_model.conf', a);

  // Check the permission.
  e.enforce('alice', 'data1', 'read');

  // Save the policy back to DB.
  await e.savePolicy();
}

main();
```

**Important**: When using custom output paths, you must always pass a PrismaClient instance to the adapter. The adapter will attempt to dynamically import from `@prisma/client` only when no instance is provided and the adapter is initialized.

## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)

## License

This project is under Apache 2.0 License. See the [LICENSE](LICENSE) file for the full license text.
