import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDatabaseMock } from '../../test/user-database.mock';
import { FindOneParams } from '../utils';
import { UserEntity } from './user.entity';
import { UserInput } from './user.input';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let userDatabaseMock: UserDatabaseMock;
  let controller: UsersController;
  let repository: Repository<UserEntity>;

  beforeAll(() => {
    userDatabaseMock = new UserDatabaseMock();
    userDatabaseMock.init(20);
  });

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
    it('should return a list of all users', async () => {
      jest.spyOn(repository, 'find').mockImplementationOnce(() => {
        return userDatabaseMock.findAll();
      });

      const users = await userDatabaseMock.findAll();

      await expect(controller.findAll()).resolves.toEqual(
        users.map((entity) => entity.toDto()),
      );
    });
  });

  describe('Find One', () => {
    const params = new FindOneParams();

    it("should throw NotFoundException if the user record isn't found", () => {
      mockOnceFindOneById();

      params.id = -1;

      expect(controller.findOne(params)).rejects.toEqual(
        new NotFoundException(),
      );
    });

    it('should return a user record', async () => {
      mockOnceFindOneById();

      const record = await userDatabaseMock.findOneById(1);
      expect(record).toBeDefined();
      params.id = record.id;

      await expect(controller.findOne(params)).resolves.toEqual(record.toDto());
    });
  });

  describe('Create record', () => {
    const input = new UserInput();
    input.firstName = faker.name.firstName();
    input.lastName = faker.name.lastName();

    it("should throw BadRequestException if the user's email isn't unique", async () => {
      mockOnceFindOneByEmail();

      const record = await userDatabaseMock.findOneById(1);
      input.email = record.email;

      await expect(controller.create(input)).rejects.toEqual(
        new BadRequestException(['email must be unique']),
      );
    });

    it('should create a new record', async () => {
      mockOnceFindOneByEmail();
      mockOnceSave();

      input.email = faker.internet.email();

      const result = await controller.create(input);
      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result).toMatchObject(input);
      expect(result.createdDateTime).not.toBeNull();
      expect(result.updatedDateTime).not.toBeNull();
    });
  });

  describe('Update record', () => {
    const params = new FindOneParams();
    params.id = -1;
    const input = new UserInput();
    input.email = faker.internet.email();
    input.firstName = faker.name.firstName();
    input.lastName = faker.name.lastName();
    let record: UserEntity;

    it("should throw NotFoundException if the user record isn't found", () => {
      mockOnceFindOneById();
      expect(controller.update(params, input)).rejects.toEqual(
        new NotFoundException(),
      );
    });

    it("should throw BadRequestException if the user's email isn't unique", async () => {
      mockOnceFindOneById();
      mockOnceFindOneByEmail();

      record = await userDatabaseMock.findOneById(2);
      expect(record).toBeDefined();
      params.id = 1;
      input.email = record.email;

      await expect(controller.update(params, input)).rejects.toEqual(
        new BadRequestException(['email must be unique']),
      );
    });

    it('should update the record', async () => {
      mockOnceFindOneById();
      mockOnceFindOneByEmail();
      mockOnceSave();

      record = await userDatabaseMock.findOneById(1);
      expect(record).toBeDefined();
      params.id = record.id;
      input.email = faker.internet.email();
      const recordDto = record.toDto();
      const user = await controller.update(params, input);

      expect(user).toBeDefined();
      expect(user.id).toEqual(recordDto.id);
      expect(user).toMatchObject(input);
      expect(user.createdDateTime).toEqual(recordDto.createdDateTime);
      expect(user.updatedDateTime).not.toBeNull();
      expect(user.updatedDateTime).not.toEqual(recordDto.updatedDateTime);
    });
  });

  describe('Delete record', () => {
    const params = new FindOneParams();
    params.id = -1;

    it("should throw NotFoundException if the user record isn't found", () => {
      mockOnceFindOneById();
      expect(controller.delete(params)).rejects.toEqual(
        new NotFoundException(),
      );
    });

    it('should delete the user record', async () => {
      mockOnceFindOneById();
      jest
        .spyOn(repository, 'delete')
        .mockImplementationOnce((conditions: any) => {
          return userDatabaseMock.delete(conditions.id);
        });

      const record = await userDatabaseMock.findOneById(1);
      expect(record).toBeDefined();
      params.id = record.id;

      await expect(controller.delete(params)).resolves.toEqual(record.toDto());
    });
  });

  function mockOnceFindOneById() {
    jest.spyOn(repository, 'findOne').mockImplementationOnce((conditions) => {
      return userDatabaseMock.findOneById(conditions as number);
    });
  }

  function mockOnceFindOneByEmail() {
    jest
      .spyOn(repository, 'findOne')
      .mockImplementationOnce((conditions: any) => {
        return userDatabaseMock.findOneByEmail(conditions.where.email);
      });
  }

  function mockOnceSave() {
    jest
      .spyOn(repository, 'save')
      .mockImplementationOnce((record: UserEntity) => {
        return userDatabaseMock.save(record);
      });
  }
});
