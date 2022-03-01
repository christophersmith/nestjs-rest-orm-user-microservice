import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * SwaggerHelper provides common elements used to document the Swagger API.
 */
export class SwaggerHelper {
  /**
   * A Swagger schema that defines what's returned when the requested record is not found.
   */
  static SCHEMA_NOT_FOUND: SchemaObject = {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 404,
      },
      message: {
        type: 'string',
        example: 'Not Found',
      },
    },
    required: ['statusCode', 'message'],
  };
  /**
   * A Swagger schema that defines what's returned when the user identifier is not valid.
   *
   * @see FindOneParams
   */
  static SCHEMA_USER_ID_BAD_REQUEST: SchemaObject = {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 400,
      },
      message: {
        type: '[string]',
        example: '["id must be a number string"]',
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
    },
    required: ['statusCode', 'message'],
  };
  /**
   * A Swagger schema that defines what's returned when user input is not valid.
   *
   * @see UserInput
   */
  static SCHEMA_USER_INPUT_BAD_REQUEST: SchemaObject = {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 400,
      },
      message: {
        type: '[string]',
        example:
          '["email must be unique","email must be an email","firstName should not be empty","lastName should not be empty"]',
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
    },
    required: ['statusCode', 'message'],
  };
  /**
   * A Swagger tag for grouping Users functionality.
   */
  static TAG_USERS = 'Users';
}
