import { ApiProperty } from '@nestjs/swagger';

/**
 * The returned object for all user records.
 */
export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'user@domain.com' })
  email: string;
  @ApiProperty({ example: 'Tom' })
  firstName: string;
  @ApiProperty({ example: 'Jones' })
  lastName: string;
  @ApiProperty({ example: '2022-02-27T17:09:21.263Z' })
  createdDateTime: string;
  @ApiProperty({ example: '2022-02-27T17:09:21.263Z' })
  updatedDateTime: string;
}
