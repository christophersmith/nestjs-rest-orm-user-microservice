import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindOneParams, SwaggerHelper } from '../utils';
import { UserDto } from './user.dto';
import { UserInput } from './user.input';
import { UsersService } from './users.service';

/**
 * UsersController defines all REST API enpoints and HTTP verbs for working with user records.
 */
@ApiTags(SwaggerHelper.TAG_USERS)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all user records',
    description:
      'Returns a list of user records that are sorted by Last Name and First Name.',
  })
  @ApiResponse({ type: [UserDto] })
  async findAll(): Promise<UserDto[]> {
    return this.service.find();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user record by id' })
  @ApiOkResponse({ description: 'Record found', type: UserDto })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: SwaggerHelper.SCHEMA_USER_ID_BAD_REQUEST,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    schema: SwaggerHelper.SCHEMA_NOT_FOUND,
  })
  async findOne(@Param() params: FindOneParams): Promise<UserDto> {
    return this.service.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a user record' })
  @ApiCreatedResponse({ description: 'Record created', type: UserDto })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: SwaggerHelper.SCHEMA_USER_INPUT_BAD_REQUEST,
  })
  async create(@Body() input: UserInput): Promise<UserDto> {
    return this.service.create(input);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a user record' })
  @ApiOkResponse({ description: 'Record updated', type: UserDto })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: SwaggerHelper.SCHEMA_USER_INPUT_BAD_REQUEST,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    schema: SwaggerHelper.SCHEMA_NOT_FOUND,
  })
  async update(
    @Param() params: FindOneParams,
    @Body() input: UserInput,
  ): Promise<UserDto> {
    return this.service.update(params.id, input);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user record' })
  @ApiOkResponse({ description: 'Record deleted', type: UserDto })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: SwaggerHelper.SCHEMA_USER_ID_BAD_REQUEST,
  })
  @ApiNotFoundResponse({
    description: 'Record not found',
    schema: SwaggerHelper.SCHEMA_NOT_FOUND,
  })
  async delete(@Param() params: FindOneParams): Promise<UserDto> {
    return this.service.delete(params.id);
  }
}
