

<div>
  <p align="center">A template project using <a href="https://nestjs.com" target="_blank">NestJS</a> + <a href="https://www.prisma.io" target="_blank">Prisma</a> using <a href="http://nodejs.org" target="_blank">Node.js</a> for building efficient and scalable server-side applications.</p>
  <p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  </p>
</div>

## 📄 Description

**Rennan's Template API** is a NestJS starter template with pre-configured and  ready-to-use API structure, firebase authentication and Prisma with PostgresSQL or MySQL initial configurations.

## 📋 Features

- 🚀 **Ready-to-use API template**
- 🔐 **Firebase Authentication system**
- 🐘 **PostgreSQL with Prisma ORM**
- 📦 **Pre-configured Docker setup**
- ✅ **Testing environment configured [fixing]**

## 🔧 Installation

> Clone repository
> ```sh
> git clone https://github.com/your-repo/rennan-template-api.git
> ```
> Enter in new repository folder
> ```sh
> cd rennan-template-api
> ```
> Install all node dependencies (use yarn or npm install)
> ```sh
> yarn
> ```
> Create a .env file based on .env.example:
> ```sh
> cp .env.example .env
> ```

Attention: You need to create a .env file in the root of the project with .env.example content.

> Generate typed files from schema.prisma to typescript
> ```sh
> yarn prisma:generate
> ```
> Run nest application
> ```sh
> yarn start
> ```
> Watch mode
> ```sh
> yarn dev
> ```

Attention: To run the application for first time using new database, you need to comment the line 10 in schema.prisma file "shadowDatabaseUrl = env("DATABASE_SHADOW_URL")" and run the command. After that, you can uncomment the line 10 in schema.prisma and create de database postgres_shadow in your local machine.

> Generate or apply the prisma migration
> ```sh
> yarn prisma:migrate
> ```

## 📦 API Documentation
* After starting the application, access the Swagger documentation at: http://localhost:3000/api-swagger

* To get swagger in JSON (for Orval or somenthing like): http://localhost:3000/api-swagger-json


## ⚙️ Testing (SORRY! Tests automation needs to be fixed)

> Unit tests
> ```sh
> npm run test
> ```
> Tests e2e
> ```sh
> npm run test:e2e
> ```
> Test coverage
> ```sh
> npm run test:cov
> ```

## ❤️ Support

This Rennan's Template API is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please send me an email (rennanmore@gmail.com) or [dicover more about project](https://github.com/rennanmoreira/rennan-template-api).

## ✨ Stay in touch

- Author - [Rennan Moreira Pinto](https://www.linkedin.com/in/rennanmoreira/)
- NestJS - [https://nestjs.com](https://nestjs.com/)
- Prisma - [https://www.prisma.io](https://www.prisma.io)

## 📜 License

Nest is [MIT licensed](LICENSE).
