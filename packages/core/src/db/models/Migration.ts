import { getDBClient } from "@db/db";

// -------------------------------------------
// Types

type MigrationAll = () => Promise<MigrationT[]>;

type MigrationCreate = (data: {
  file: string;
  rawSql: string;
}) => Promise<void>;

// -------------------------------------------
// Migration
export type MigrationT = {
  id: string;
  file: string;
  created_at: string;
};

export default class Migration {
  // -------------------------------------------
  // Public
  static all: MigrationAll = async () => {
    const client = await getDBClient();

    try {
      const migrations = await client.query<MigrationT>(
        `SELECT * FROM lucid_migrations`
      );
      return migrations.rows;
    } catch (err) {
      // as this is never used within the app, we dont throw an error to the request
      return [];
    } finally {
      client.release();
    }
  };
  static create: MigrationCreate = async (data) => {
    const client = await getDBClient();

    try {
      const { file, rawSql } = data;
      await client.query({
        text: rawSql,
      });
      await client.query({
        text: `INSERT INTO lucid_migrations (file) VALUES ($1)`,
        values: [file],
      });
    } finally {
      client.release();
    }
  };
  // -------------------------------------------
  // Util Functions
}
