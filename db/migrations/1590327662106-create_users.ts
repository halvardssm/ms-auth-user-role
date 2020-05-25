import { Schema } from "../../deps.ts";

export const up = (schema: Schema): void => {
  schema.create("users", (table) => {
    table.id();
    table.string("username", 32).unique();
    table.string("password", 256);
    table.timestamps();
  });

  schema.create("roles", (table) => {
    table.id();
    table.string("name", 32).unique();
    table.timestamps();
  });

  schema.create("privileges", (table) => {
    table.id();
    table.string("name", 32).unique();
    table.timestamps();
  });

  schema.create("user_role", (table) => {
    table.bigInteger("user_id").custom(
      "REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE",
    );
    table.bigInteger("role_id").custom(
      "REFERENCES roles (id) ON UPDATE CASCADE ON DELETE CASCADE",
    );
    table.primary("user_id", "role_id");
  });

  schema.create("role_privilege", (table) => {
    table.bigInteger("role_id").custom(
      "REFERENCES roles (id) ON UPDATE CASCADE ON DELETE CASCADE",
    );
    table.bigInteger("privilege_id").custom(
      "REFERENCES privileges (id) ON UPDATE CASCADE ON DELETE CASCADE",
    );
    table.primary("role_id", "privilege_id");
  });
};

export const down = (schema: Schema): void => {
  schema.drop(
    ["users", "roles", "privileges", "users_roles", "roles_privileges"],
    true,
    true,
  );
};
