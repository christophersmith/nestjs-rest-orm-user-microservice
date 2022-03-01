import faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { UserEntity } from '../../users/user.entity';

/**
 * A seeding factory used to create user records.
 *
 * This factory is used by {@link UserSeed}.
 */
define(UserEntity, () => {
  const record = new UserEntity();
  record.email = faker.internet.email();
  record.firstName = faker.name.firstName();
  record.lastName = faker.name.lastName();
  return record;
});
