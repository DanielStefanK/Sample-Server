import { createTypeormConn } from '../utils/createTypeormConn';
import { Connection, BaseEntity, ObjectType } from 'typeorm';
import { User } from '../entity/User';

let conn: Connection;

export const clearAll = async (
  entities: Array<ObjectType<BaseEntity>>,
): Promise<void> => {
  if (!conn || !conn.isConnected) {
    conn = await createTypeormConn();
  }

  try {
    for await (const entity of entities) {
      const repository = await conn.getRepository(entity);
      await repository.query(`DELETE FROM ${repository.metadata.tableName};`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
};

export const host: string = process.env.TEST_HOST || 'http://localhost:4004';

beforeEach(async done => {
  await clearAll([User]);
  done();
});

afterAll(async done => {
  if (conn && conn.isConnected) {
    await conn.close();
  }
  done();
});
