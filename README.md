# Microservice Authentication, User and Role Management

![CI](https://github.com/halvardssm/ms-auth/workflows/CI/badge.svg)
[![(Deno)](https://img.shields.io/badge/deno-1.0.2-green.svg)](https://deno.land)

Authentication, user and role management microservice.

## Usage

* Run the application:

  ```deno run --allow-net --allow-read --allow-write --allow-plugin --unstable mod.ts```

## Contributing

As this is a personal microservice, the application will be heavily subjective. Feel free to create an issue if there is something you would like to see implementd or supported.

## Uses

* [Nessie](https://deno.land/x/nessie/)
* [Oak](https://deno.land/x/oak/)
  * [Middleware JWT](https://github.com/halvardssm/oak-middleware-jwt)
  * [Middleware Error Handling and Logger](https://github.com/halvardssm/oak-middleware-error-logger)
* [Deno Postgres](https://deno.land/x/deno-postgres/)
* [Argon2](https://deno.land/x/argon2/)
* [djwt](https://deno.land/x/djwt/)
