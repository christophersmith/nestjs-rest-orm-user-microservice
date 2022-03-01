import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * UserInput encapsulates and validates request input for a user.
 */
export class UserInput {
  @ApiProperty({ example: 'user@domain.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;
  @ApiProperty({ example: 'Tom', maxLength: 64 })
  @IsNotEmpty()
  @MaxLength(64)
  firstName: string;
  @ApiProperty({ example: 'Jones', maxLength: 64 })
  @IsNotEmpty()
  @MaxLength(64)
  lastName: string;
}
