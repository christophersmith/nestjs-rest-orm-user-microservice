import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserDto } from './user.dto';
import { UserInput } from './user.input';

/**
 * A TypeORM entity for interacting with the User database table.
 */
@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'UserId' })
  id: number;
  @Column({ name: 'Email', type: 'varchar', length: 255, nullable: false })
  email: string;
  @Column({ name: 'FirstName', type: 'varchar', length: 64, nullable: false })
  firstName: string;
  @Column({ name: 'LastName', type: 'varchar', length: 64, nullable: false })
  lastName: string;
  @CreateDateColumn({
    name: 'CreatedDateTime',
    type: 'datetime2',
    nullable: false,
  })
  createdDateTime: Date;
  @UpdateDateColumn({
    name: 'UpdatedDateTime',
    type: 'datetime2',
    nullable: false,
  })
  updatedDateTime: Date;

  /**
   * TypeORM function that is called before a new record is inserted into the database.
   *
   * Sets the creatddDateTime and updatedDateTime to the current {@link Date}.
   */
  @BeforeInsert()
  handleBeforeInsert() {
    const currentDate = new Date();
    this.createdDateTime = currentDate;
    this.updatedDateTime = currentDate;
  }

  /**
   * TypeORM function that is called before a record is updated.
   *
   * Sets the updatedDateTime to the current {@link Date}.
   */
  @BeforeUpdate()
  handleBeforeUpdate() {
    this.updatedDateTime = new Date();
  }

  /**
   * A convenience function that converts the current record to an {@link UserDto} object.
   *
   * @returns a {@link UserDto} object
   */
  toDto(): UserDto {
    const record = new UserDto();
    record.id = this.id;
    record.email = this.email;
    record.firstName = this.firstName;
    record.lastName = this.lastName;
    record.createdDateTime = this.createdDateTime.toISOString();
    record.updatedDateTime = this.updatedDateTime.toISOString();
    return record;
  }

  /**
   * A convenience function that assigns values from an {@link UserInput} object to the current record.
   */
  populateFromInput(input: UserInput) {
    this.email = input.email;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
  }
}
