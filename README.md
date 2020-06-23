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

You may find other 3rd-party supported DBs in Prisma website or other places.

## Installation

```
npm install casbin-prisma-adapter --save
```

## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)

## License

This project is under Apache 2.0 License. See the [LICENSE](LICENSE) file for the full license text.
