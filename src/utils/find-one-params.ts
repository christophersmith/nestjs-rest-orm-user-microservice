import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

/**
 * FindOneParams encapsulates and validates request input for a user identifier.
 */
export class FindOneParams {
  @ApiProperty()
  @IsNumberString()
  id: number;
}
