# Clean Node Advanced

![Build-CI](https://github.com/LucasAuSilva/clean-node-advanced/actions/workflows/build-ci.yml/badge.svg)
![Coveralls](https://img.shields.io/coveralls/github/LucasAuSilva/clean-node-advanced)
![License](https://img.shields.io/github/license/LucasAuSilva/clean-node-advanced?style=plastic)
![Version](https://img.shields.io/github/v/release/LucasAuSilva/clean-node-advanced?style=plastic)

<div align="center">
  <img height="60%" width="60%" src="https://github.com/rmanguinho/advanced-node/raw/master/public/img/logo-course.jpeg" alt="cape image of the advanced ts node course of Rodrigo manguinho"/>
</div>

<div align="center">
  <img height="42" width="42" src="https://simpleicons.now.sh/tsnode/3178C6" alt="Node and typescript"/>
  <img height="42" width="42" src="https://simpleicons.now.sh/jest/C21325" alt="jest" />
  <img height="42" width="42" src="https://simpleicons.now.sh/git/F05032" alt="git" />
  <img height="42" width="42" src="https://simpleicons.now.sh/postgresql/4169E1" alt="PostgresSQL logo" />
  <img height="42" width="42" src="https://simpleicons.now.sh/amazons3/569A31" alt="Aws s3 logo" />
  <img height="42" width="42" src="https://simpleicons.now.sh/prisma/fafafa" alt="Prisma logo" />
  <img height="42" width="42" src="https://simpleicons.now.sh/githubactions/2088FF" alt="github actions logo" />
  <img height="42" width="42" src="https://simpleicons.now.sh/heroku/430098" alt="heroku logo" />
</div>

Contents
=============

<!--ts-->
* [Features](#features)
* [Concepts used](#programming-concepts-used)
  * [Principles](#principles)
  * [Design Patterns](#design-patterns)
  * [Methodologies](#designs-and-methodologies)
* [How to run it](#how-to-run-it)
* [Technologies](#technologies-in-the-project)
* [Versioning](#versioning)
* [History](#history)
* [Author](#author)
<!--te-->

## Features

* [Login Facebook](./documentation/facebook-authentication/use-case.md)
* [Save profile picture](./documentation/change-profile-picture/use-case.md)
* [Delete profile picture](./documentation/change-profile-picture/use-case.md)

## Programming concepts used

### Principles

* Single Responsibility Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Separation of Concerns (SOC)
* Don't Repeat Yourself (DRY)
* You Aren't Gonna Need It (YAGNI)
* Keep It Simple, Silly (KISS)
* Composition Over Inheritance
* Small Commits

### Design Patterns

* Factory
* Adapter
* Composite
* Decorator
* Proxy
* Dependency Injection
* Abstract Server
* Composition Root
* Builder
* Singleton

### Designs and Methodologies

* TDD
* Clean Architecture
* DDD
* Conventional Commits
* GitFlow
* Modular Design
* Dependency Diagrams
* Use Cases
* Continuous Integration
* Continuous Delivery
* Continuous Deployment

## How to run it

> Before run the project you need to confirm that you have this tools installed:
> [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/)

> Also for run te project you have to setup an .env file with your secrets

```bash
# Clone this repository
$ git clone https://github.com/LucasAuSilva/clean-node-advanced.git
```

```bash
# Access the directory where you clone the repo
$ cd clean-node-advanced
```

```bash
# Install the dependencies
$ npm install
```

```bash
# Start the project
$ npm run dev
```

> For you be able to run the tests you need to run this command.

```bash
# Setup the db test environment with sql lite instead of Postgres
$ npm run env:test
```

## Technologies-in-the-project

* [Node.js](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
* [Jest](https://reactnative.dev/)
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/)
* [PostgresSQL](https://www.postgresql.org/)
* [Github Actions](https://github.com/features/actions)
* [Prisma](https://www.prisma.io/)
* [AWS S3](https://aws.amazon.com/pt/s3/)

## Versioning

To keep better organization of releases we follow the [Semantic Versioning 2.0.0](http://semver.org/) guidelines.

## History

See [Releases](https://github.com/LucasAuSilva/clean-node-advanced/releases) for detailed changelog.

## Author

<a href="https://github.com/LucasAuSilva">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/69608721?v=4" width="100px;" alt="My picture"/>
 <br />
 <sub><b>Lucas Augusto da Silva</b></sub></a>

[![LinkedIn Badge](https://img.shields.io/badge/-Lucas-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/tgmarinho/)](https://www.linkedin.com/in/lucas-augusto-silva-6a12aa135/)
[![Gmail Badge](https://img.shields.io/badge/-silvaaugustolucas@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:tgmarinho@gmail.com)](mailto:silvaaugustolucas@gmail.com)

> Link for the Udemy training click [here](https://www.udemy.com/course/nodejs-avancado/)
