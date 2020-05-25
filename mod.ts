import { findOne, Privilege, query, Role, User } from "./db/db.ts";
import {
  Router,
  ErrorStatus,
  verify,
  Payload,
  Jose,
  makeJwt,
  Application,
  Middleware,
  errorHandlerMiddleware,
  jwtMiddleware,
  logger,
} from "./deps.ts";

const SECRET_KEY = "your-secret";

const PATH_USER = "/user";
const PATH_USER_ID = "/user/:id";
const PATH_AUTHENTICATE = "/authenticate";

const router = new Router();

interface ApplicationState {
  userId: string;
}

const restrictiveObjectAssign = (
  target: Record<string, any>,
  ...sources: Record<string, any>[]
) => {
  for (const key of Object.keys(target)) {
    for (let i = sources.length - 1; i >= 0; i--) {
      if (sources[i].hasOwnProperty(key)) {
        target[key] = sources[i][key];
        break;
      }
    }
  }
};

router
  .get(PATH_AUTHENTICATE, async (ctx) => {
    const { request, response } = ctx;
    let result: { msg?: string | object } = {};
    const body = (await request.body()).value;

    if (!body.username) {
      ctx.throw(ErrorStatus.UnprocessableEntity, "Username not provided");
    } else if (!body.password) {
      ctx.throw(ErrorStatus.UnprocessableEntity, "Password not provided");
    } else {
      const queryResult = await query<Partial<User | Role>>(
        `SELECT u.password, r.name FROM users u, roles r WHERE username = '${body.username}' JOIN ON `,
      );

      if (
        queryResult && queryResult.length > 0 &&
        await verify(queryResult[0].password, body.password)
      ) {
        const payload: Payload = {
          iss: body.username,
          role: queryResult[0].role,
          iat: new Date().getTime(),
        };

        const header: Jose = {
          alg: "HS512",
          typ: "JWT",
        };

        const token = makeJwt({ header, payload, key: SECRET_KEY });
        result.msg = { token };
      } else {
        ctx.throw(ErrorStatus.Unauthorized);
      }
    }

    response.body = result;
  })
  // .get(PATH_USERS, (context) => {
  // 	context.response.body = Array.from(users.values());
  // })
  .post(PATH_USER, async (ctx) => {
    const body = (await ctx.request.body()).value as Partial<User>;
    if (body.username && body.password) {
      await query(
        `insert into users (username, password) values ('${body.username}','${body.password}')`,
      );
    } else {
      ctx.throw(ErrorStatus.UnprocessableEntity);
    }
  })
  .get(PATH_USER_ID, async (ctx) => {
    const { response, params } = ctx;
    if (params?.id) {
      if (params.id === ctx.state.userId) {
        const queryResult = await query<User>(
          `SELECT * FROM users WHERE username = '${params.id}'`,
        );
        response.body.msg = queryResult;
        return;
      } else {
        const queryResult = await query<Partial<Privilege>>(
          `SELECT p.name FROM privileges p INNER JOIN role_privilege rp ON p.id = rp.privilege_id INNER JOIN user_role ur ON rp.role_id = ur.role_id INNER JOIN users u ON ur.user_id = u.id WHERE u.username = '${ctx.state.userId}'`,
        );

        if (queryResult?.find((el) => el.name === "read_all_users")) {
          const queryResult = await findOne<User>(
            `SELECT * FROM users WHERE username = '${params.id}'`,
          );

          response.body.msg = queryResult;
          return;
        } else {
          ctx.throw(ErrorStatus.Unauthorized);
        }
      }
    }
  });
// .put(PATH_USER)
// .delete(PATH_USER);

const app = new Application<ApplicationState>();

app.use(
  errorHandlerMiddleware<Middleware>({
    fallback: (err, ctx) => logger({ logInfo: err as string | object }),
  }),
  jwtMiddleware<Middleware>({
    secret: SECRET_KEY,
    ignorePatterns: [
      { path: "/authenticate" },
      { path: PATH_USER, methods: ["POST"] },
    ],
  }),
  router.routes(),
  router.allowedMethods(),
);

console.log("listening on port 8000");

await app.listen({ port: 8000 });
