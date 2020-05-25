import { Client, QueryResult } from "../deps.ts";
import connectionOptions from "../nessie.config.ts";

interface Model {
	[any: string]: any;
}

interface ModelWithTimestamps extends Model {
	created_at: string;
	updated_at: string;
}
interface ModelWithId extends Model {
	id: number;
}

export interface User extends ModelWithTimestamps, ModelWithId {
	username: string;
	password: string;
}

export interface Role extends ModelWithTimestamps, ModelWithId {
	name: string;
}

export interface Privilege extends ModelWithTimestamps, ModelWithId {
	name: string;
}
export interface UserRole {
	user_id: number;
	role_id: number;
}
export interface RolePrivilege {
	role_id: number;
	privilege_id: number;
}

export const query = async <T extends Model>(
	queryString: string,
): Promise<Array<T> | undefined> => {
	try {
		const client = new Client(connectionOptions.connection);

		await client.connect();
		const result = await client.query({ text: queryString });
		await client.end();

		return result.rowsOfObjects() as T[];
	} catch (err) {
		console.error(err);
	}
};

export const findOne = async <T extends Model>(
	queryString: string,
): Promise<T | undefined> => {
	const queryResult = await query<T>(queryString) as T[];
	return queryResult?.[0];
};
