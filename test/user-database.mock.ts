import { UserEntity } from '../src/users/user.entity';
import { faker } from '@faker-js/faker';
import { DeleteResult } from 'typeorm';

export class UserDatabaseMock {
  private users: UserEntity[] = [];

  init(count: number) {
    for (let id = 1; id <= count; id++) {
      const record = new UserEntity();
      record.id = id;
      record.email = faker.internet.email();
      record.firstName = faker.name.firstName();
      record.lastName = faker.name.lastName();
      record.handleBeforeInsert();
      this.users.push(record);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users.map((record) => record.clone());
  }

  async findOneById(id: number): Promise<UserEntity | undefined> {
    let record: UserEntity;
    this.users.forEach((user) => {
      if (user.id == id) {
        record = user.clone();
      }
    });
    return record;
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    let record: UserEntity;
    this.users.forEach((user) => {
      if (user.email.toLowerCase() == email.toLowerCase()) {
        record = user.clone();
      }
    });
    return record;
  }

  async save(record: UserEntity): Promise<UserEntity> {
    let user = this.users.find((element) => element.id == record.id);
    if (user) {
      user.email = record.email;
      user.firstName = record.firstName;
      user.lastName = record.lastName;
      user.handleBeforeUpdate();
      this.users[this.users.findIndex((element) => element.id == user.id)] =
        user.clone();
    } else {
      user = new UserEntity();
      user.id = this.users.length + 1;
      user.email = record.email;
      user.firstName = record.firstName;
      user.lastName = record.lastName;
      user.handleBeforeInsert();
      this.users.push(user);
    }
    return user.clone();
  }

  async delete(id: number): Promise<DeleteResult> {
    const index = this.users.findIndex((element) => element.id == id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
    return new DeleteResult();
  }
}
