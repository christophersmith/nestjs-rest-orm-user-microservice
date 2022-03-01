import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FindOneParams } from '../utils';
import { UserEntity } from './user.entity';
import { UserInput } from './user.input';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find All', () => {
    it('should return a list of all users', () => {
      const users: UserEntity[] = [];
      for (let index = 1; index <= 10; index++) {
        const record = new UserEntity();
        record.id = index;
        record.email = faker.internet.email();
        record.firstName = faker.name.firstName();
        record.lastName = faker.name.lastName();
        record.handleBeforeInsert();
        users.push(record);
      }

      jest.spyOn(repository, 'find').mockImplementationOnce(() => {
        return Promise.resolve(users);
      });
      expect(controller.findAll()).resolves.toEqual(
        users.map((entity) => entity.toDto()),
      );
    });
  });

  describe('Find One', () => {
    it("should throw NotFoundException if the user record isn't found", () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return undefined;
      });
      const params = Object.assign(FindOneParams, { id: 1 });
      expect(controller.findOne(params)).rejects.toEqual(
        new NotFoundException(),
      );
    });

    it('should return a user record', () => {
      const record = new UserEntity();
      record.id = 1;
      record.email = faker.internet.email();
      record.firstName = faker.name.firstName();
      record.lastName = faker.name.lastName();
      record.createdDateTime = new Date();
      record.updatedDateTime = new Date();
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      const params = Object.assign(FindOneParams, { id: record.id });
      expect(controller.findOne(params)).resolves.toEqual(record.toDto());
    });
  });

  describe('Create record', () => {
    const input = new UserInput();
    input.email = faker.internet.email();
    input.firstName = faker.name.firstName();
    input.lastName = faker.name.lastName();
    const record = new UserEntity();
    record.id = 1;
    record.populateFromInput(input);
    record.handleBeforeInsert();

    it("should throw BadRequestException if the user's email isn't unique", () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      expect(controller.create(input)).rejects.toEqual(
        new BadRequestException(['email must be unique']),
      );
    });

    it('should create a new record', () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(undefined);
      });
      jest.spyOn(repository, 'save').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      expect(controller.create(input)).resolves.toEqual(record.toDto());
    });
  });

  describe('Update record', () => {
    const params = Object.assign(FindOneParams, { id: 1 });
    const input = new UserInput();
    input.email = faker.internet.email();
    input.firstName = faker.name.firstName();
    input.lastName = faker.name.lastName();
    const record = new UserEntity();
    record.id = 1;
    record.populateFromInput(input);
    record.handleBeforeInsert();
    const dupEmailRecord = new UserEntity();
    dupEmailRecord.id = 2;
    dupEmailRecord.email = record.email;

    it("should throw NotFoundException if the user record isn't found", () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(undefined);
      });
      expect(controller.update(params, input)).rejects.toEqual(
        new NotFoundException(),
      );
    });

    it("should throw BadRequestException if the user's email isn't unique", () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(dupEmailRecord);
      });
      expect(controller.update(params, input)).rejects.toEqual(
        new BadRequestException(['email must be unique']),
      );
    });

    it('should update the record', () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      record.handleBeforeUpdate();
      jest.spyOn(repository, 'save').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      expect(controller.update(params, input)).resolves.toEqual(record.toDto());
    });
  });

  describe('Delete record', () => {
    const params = Object.assign(FindOneParams, { id: 1 });
    const record = new UserEntity();
    record.id = 1;
    record.email = faker.internet.email();
    record.firstName = faker.name.firstName();
    record.lastName = faker.name.lastName();
    record.handleBeforeInsert();

    it("should throw NotFoundException if the user record isn't found", () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return undefined;
      });
      expect(controller.delete(params)).rejects.toEqual(
        new NotFoundException(),
      );
    });

    it('should delete the user record', () => {
      jest.spyOn(repository, 'findOne').mockImplementationOnce(() => {
        return Promise.resolve(record);
      });
      jest.spyOn(repository, 'delete').mockImplementationOnce(() => {
        return Promise.resolve(new DeleteResult());
      });
      expect(controller.delete(params)).resolves.toEqual(record.toDto());
    });
  });
});
