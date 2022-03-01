import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { UserEntity } from '../../users/user.entity';

/**
 * A typeorm-seeding seeder implementation that handles populating dummy user records
 * for development.
 *
 * This seeder will remove all records from the User table then create twenty user
 * records.
 */
export default class UserSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const repository = connection.getRepository(UserEntity);
    await Promise.all(
      (await repository.find()).map((record) => repository.remove(record)),
    );
    await factory(UserEntity)().createMany(20);
  }
}
