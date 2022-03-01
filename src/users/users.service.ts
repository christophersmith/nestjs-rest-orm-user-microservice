import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserInput } from './user.input';

/**
 * UsersService provides business logic and interaction with the database for dealing with user records.
 */
@Injectable()
export class UsersService {
  /**
   * The default constructor.
   *
   * @param repository an injected {@link Repository} for {@link UserEntity}
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  /**
   * Returns a list of all user records sorted by Last Name and First Name.
   *
   * @returns an array of {@link UserDto} records
   */
  async find(): Promise<UserDto[]> {
    return (
      await this.repository.find({
        order: {
          lastName: 'ASC',
          firstName: 'ASC',
        },
      })
    ).map((entity) => entity.toDto());
  }

  /**
   * Finds and returns one user record.
   *
   * @throws a {@link NotFoundException} if the user record wasn't found
   * @param id numeric identifer of the user record to find
   * @returns a {@link UserDto} record
   */
  async findOne(id: number): Promise<UserDto> {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException();
    }
    return record.toDto();
  }

  /**
   * Creates a new user record.
   *
   * @throws a {@link BadRequestException} if the user email is not unique
   * @param input a {@link UserInput} object with the user details
   * @returns the {@link UserDto} of the created user record
   */
  async create(input: UserInput): Promise<UserDto> {
    const record = new UserEntity();
    record.populateFromInput(input);
    return (await this.save(record)).toDto();
  }

  /**
   * Updates an existing user record.
   *
   * @throws a {@link NotFoundException} if the user record wasn't found
   * @throws a {@link BadRequestException} if the user email is not unique
   * @param id numeric identifer of the user record to update
   * @param input a {@link UserInput} object with the user details
   * @returns the {@link UserDto} of the updated user record
   */
  async update(id: number, input: UserInput): Promise<UserDto> {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException();
    }
    record.populateFromInput(input);
    return (await this.save(record)).toDto();
  }

  /**
   * Saves a user record.
   *
   * @throws a {@link BadRequestException} if the user email is not unique
   * @param record the {@link UserEntity} record to save
   * @returns the {@link UserEntity} record that was saved
   */
  private async save(record: UserEntity): Promise<UserEntity> {
    const emailCheck = await this.repository.findOne({
      where: { email: record.email },
    });
    if (emailCheck && emailCheck.id != record.id) {
      throw new BadRequestException(['email must be unique']);
    }
    return await this.repository.save(record);
  }

  /**
   * Deletes a user record for the provided identifier.
   *
   * @throws a {@link NotFoundException} if the user record wasn't found
   * @param id numeric identifer of the user record to delete
   * @returns the {@link UserDto} record that was deleted
   */
  async delete(id: number): Promise<UserDto> {
    const record = await this.findOne(id);
    await this.repository.delete({ id: id });
    return record;
  }
}
