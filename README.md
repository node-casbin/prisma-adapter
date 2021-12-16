# Prisma Adapter

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![Build Status][ci-image]][ci-url]
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/casbin/lobby)

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
- MongoDB (Preview)

You may find other 3rd-party supported DBs in Prisma website or other places.

## Installation

```
npm install casbin-prisma-adapter --save
```

## Getting Started

Append the following content to your `schema.prisma`:

```prisma
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

## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)

## License

This project is under Apache 2.0 License. See the [LICENSE](LICENSE) file for the full license text.
