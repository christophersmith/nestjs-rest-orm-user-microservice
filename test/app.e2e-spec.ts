import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isDateString } from 'class-validator';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserDto } from '../src/users/user.dto';
import { UserInput } from '../src/users/user.input';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let user1: UserDto;
  let user2: UserDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  describe('/users (GET) - all users', () => {
    it('should return an array', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
        });
    });
  });

  describe('/users (POST) - create user', () => {
    const input = new UserInput();
    it('should throw a BadRequestException with three messages when nothing is provided', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: [
              'email must be an email',
              'firstName should not be empty',
              'lastName should not be empty',
            ],
            error: 'Bad Request',
          });
        });
    });

    it('should throw a BadRequestException with two messages when only email is provided', () => {
      input.email = faker.internet.email();
      return request(app.getHttpServer())
        .post('/users')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: [
              'firstName should not be empty',
              'lastName should not be empty',
            ],
            error: 'Bad Request',
          });
        });
    });

    it('should throw a BadRequestException with one message when email and firstName is provided', () => {
      input.firstName = faker.name.firstName();
      return request(app.getHttpServer())
        .post('/users')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['lastName should not be empty'],
            error: 'Bad Request',
          });
        });
    });

    it('should insert a new user record', () => {
      input.lastName = faker.name.lastName();
      return request(app.getHttpServer())
        .post('/users')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body.id > 0).toBeTruthy();
          expect(response.body.email).toEqual(input.email);
          expect(response.body.firstName).toEqual(input.firstName);
          expect(response.body.lastName).toEqual(input.lastName);
          expect(isDateString(response.body.createdDateTime)).toBeTruthy();
          expect(isDateString(response.body.updatedDateTime)).toBeTruthy();
          user1 = response.body;
        });
    });

    it('should throw a BadRequestException when the email is not unique', () => {
      input.lastName = faker.name.lastName();
      return request(app.getHttpServer())
        .post('/users')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['email must be unique'],
            error: 'Bad Request',
          });
        });
    });
  });

  describe('/users/{id} (GET) - get one user', () => {
    it("should throw a BadRequestxception when the id isn't numeric", () => {
      return request(app.getHttpServer())
        .get('/users/abc')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['id must be a number string'],
            error: 'Bad Request',
          });
        });
    });

    it("should throw a NotFoundException when the user isn't found", () => {
      return request(app.getHttpServer())
        .get('/users/0')
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 404,
            message: 'Not Found',
          });
        });
    });

    it('should return the expected user', () => {
      return request(app.getHttpServer())
        .get(`/users/${user1.id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(user1);
        });
    });
  });

  describe('/users/{id} (PUT) - update user', () => {
    const input = new UserInput();

    it('should throw a BadRequestException with three messages when nothing is provided', () => {
      return request(app.getHttpServer())
        .put(`/users/${user1.id}`)
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: [
              'email must be an email',
              'firstName should not be empty',
              'lastName should not be empty',
            ],
            error: 'Bad Request',
          });
        });
    });

    it('should throw a BadRequestException with two messages when only email is provided', () => {
      input.email = user1.email;
      return request(app.getHttpServer())
        .put(`/users/${user1.id}`)
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: [
              'firstName should not be empty',
              'lastName should not be empty',
            ],
            error: 'Bad Request',
          });
        });
    });

    it('should throw a BadRequestException with one message when email and firstName is provided', () => {
      input.firstName = user1.firstName;
      return request(app.getHttpServer())
        .put(`/users/${user1.id}`)
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['lastName should not be empty'],
            error: 'Bad Request',
          });
        });
    });

    it("should throw a NotFoundException when the user isn't found", () => {
      input.lastName = user1.lastName;
      return request(app.getHttpServer())
        .put('/users/0')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 404,
            message: 'Not Found',
          });
        });
    });

    it("should throw a BadRequestxception when the id isn't numeric", () => {
      return request(app.getHttpServer())
        .put('/users/abc')
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['id must be a number string'],
            error: 'Bad Request',
          });
        });
    });

    it('should update the user record', () => {
      input.email = faker.internet.email();
      input.firstName = faker.name.firstName();
      input.lastName = faker.name.lastName();
      return request(app.getHttpServer())
        .put(`/users/${user1.id}`)
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toEqual(user1.id);
          expect(response.body.email).toEqual(input.email);
          expect(response.body.firstName).toEqual(input.firstName);
          expect(response.body.lastName).toEqual(input.lastName);
          expect(response.body.createdDateTime).toEqual(user1.createdDateTime);
          expect(isDateString(response.body.updatedDateTime)).toBeTruthy();
          expect(response.body.updatedDateTime).not.toEqual(
            user1.updatedDateTime,
          );
          user1 = response.body;
        });
    });

    it("should throw a BadRequestException if the email isn't unique", async () => {
      const tempInput = new UserInput();
      tempInput.email = faker.internet.email();
      tempInput.firstName = faker.name.firstName();
      tempInput.lastName = faker.name.lastName();

      await request(app.getHttpServer())
        .post('/users')
        .send(tempInput)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          user2 = response.body;
        });

      input.email = tempInput.email;

      return request(app.getHttpServer())
        .put(`/users/${user1.id}`)
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['email must be unique'],
            error: 'Bad Request',
          });
        });
    });
  });

  describe('/users/{id} (DELETE) - delete user', () => {
    it('should delete the user record', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${user1.id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(user1);
        });
      return request(app.getHttpServer())
        .delete(`/users/${user2.id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(user2);
        });
    });

    it("should throw a BadRequestxception when the id isn't numeric", () => {
      return request(app.getHttpServer())
        .delete('/users/abc')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            message: ['id must be a number string'],
            error: 'Bad Request',
          });
        });
    });

    it("should throw a NotFoundException when the user isn't found", () => {
      return request(app.getHttpServer())
        .delete(`/users/${user1.id}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 404,
            message: 'Not Found',
          });
        });
    });
  });
});
