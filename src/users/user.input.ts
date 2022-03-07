import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { OptionalStringMaxLength } from '../validation/optional-string-max-length';

/**
 * UserInput encapsulates and validates request input for a user.
 */
export class UserInput {
  @ApiProperty({ example: 'user@domain.com', maxLength: 255 })
  @IsEmail()
  @OptionalStringMaxLength(255, true)
  email: string;
  @ApiProperty({ example: 'Tom', maxLength: 64 })
  @IsNotEmpty()
  @OptionalStringMaxLength(64, false)
  firstName: string;
  @ApiProperty({ example: 'Jones', maxLength: 64 })
  @IsNotEmpty()
  @OptionalStringMaxLength(64, false)
  lastName: string;
}
