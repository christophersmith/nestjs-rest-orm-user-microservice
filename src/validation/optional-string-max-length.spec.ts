import faker from '@faker-js/faker';
import { validate } from 'class-validator';
import { UserInput } from '../users/user.input';

describe('OptionalStringMaxLength', () => {
  const input = new UserInput();

  it('should not trigger if all values are undefined', () => {
    expect(validate(input)).resolves.toMatchObject([
      {
        constraints: { isEmail: 'email must be an email' },
      },
      {
        constraints: { isNotEmpty: 'firstName should not be empty' },
      },
      {
        constraints: { isNotEmpty: 'lastName should not be empty' },
      },
    ]);
  });

  it('should not trigger if all values are defined and within spec', () => {
    input.email = faker.internet.email();
    input.firstName = faker.name.firstName();
    input.lastName = faker.name.lastName();

    expect(validate(input)).resolves.toEqual([]);
  });

  it('should trigger for firstName if the value is to long', () => {
    input.firstName = 'rightsaidfred'.repeat(15);

    expect(validate(input)).resolves.toMatchObject([
      {
        constraints: {
          optionalStringMaxLength:
            'firstName must be shorter than or equal to 64 characters',
        },
      },
    ]);
  });

  it('should trigger for firstName and lastName if the values are to long', () => {
    input.lastName = 'rightsaidfred'.repeat(15);

    expect(validate(input)).resolves.toMatchObject([
      {
        constraints: {
          optionalStringMaxLength:
            'firstName must be shorter than or equal to 64 characters',
        },
      },
      {
        constraints: {
          optionalStringMaxLength:
            'lastName must be shorter than or equal to 64 characters',
        },
      },
    ]);
  });
});
