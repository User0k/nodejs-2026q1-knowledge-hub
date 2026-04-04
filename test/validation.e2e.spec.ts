import { request } from './lib';
import { StatusCodes } from 'http-status-codes';
import {
  getTokenAndUserId,
  shouldAuthorizationBeTested,
  removeTokenUser,
} from './utils';
import {
  articlesRoutes,
  categoriesRoutes,
  commentsRoutes,
  usersRoutes,
} from './endpoints';

const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';

describe('Validation and edge cases (e2e)', () => {
  const unauthorizedRequest = request;
  const commonHeaders = { Accept: 'application/json' };
  let mockUserId: string | undefined;

  beforeAll(async () => {
    if (shouldAuthorizationBeTested) {
      const result = await getTokenAndUserId(unauthorizedRequest);
      commonHeaders['Authorization'] = result.token;
      mockUserId = result.mockUserId;
    }
  });

  afterAll(async () => {
    if (mockUserId) {
      await removeTokenUser(unauthorizedRequest, mockUserId, commonHeaders);
    }

    if (commonHeaders['Authorization']) {
      delete commonHeaders['Authorization'];
    }
  });

  describe('Input validation: empty strings', () => {
    it('should reject article with empty title', async () => {
      const response = await unauthorizedRequest
        .post(articlesRoutes.create)
        .set(commonHeaders)
        .send({
          title: '',
          content: 'Test content',
          status: 'draft',
          authorId: null,
          categoryId: null,
          tags: [],
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject article with empty content', async () => {
      const response = await unauthorizedRequest
        .post(articlesRoutes.create)
        .set(commonHeaders)
        .send({
          title: 'Test title',
          content: '',
          status: 'draft',
          authorId: null,
          categoryId: null,
          tags: [],
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject category with empty name', async () => {
      const response = await unauthorizedRequest
        .post(categoriesRoutes.create)
        .set(commonHeaders)
        .send({
          name: '',
          description: 'Test description',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject user with empty login', async () => {
      const response = await unauthorizedRequest
        .post(usersRoutes.create)
        .set(commonHeaders)
        .send({
          login: '',
          password: 'password123',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject user with empty password', async () => {
      const response = await unauthorizedRequest
        .post(usersRoutes.create)
        .set(commonHeaders)
        .send({
          login: 'user1',
          password: '',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('Input validation: wrong types', () => {
    it('should reject article with number as title', async () => {
      const response = await unauthorizedRequest
        .post(articlesRoutes.create)
        .set(commonHeaders)
        .send({
          title: 12345,
          content: 'Test content',
          status: 'draft',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject article with array as content', async () => {
      const response = await unauthorizedRequest
        .post(articlesRoutes.create)
        .set(commonHeaders)
        .send({
          title: 'Test title',
          content: ['array', 'content'],
          status: 'draft',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject category with number as description', async () => {
      const response = await unauthorizedRequest
        .post(categoriesRoutes.create)
        .set(commonHeaders)
        .send({
          name: 'Test category',
          description: 12345,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should reject comment with number as content', async () => {
      const response = await unauthorizedRequest
        .post(commentsRoutes.create)
        .set(commonHeaders)
        .send({
          content: 12345,
          articleId: randomUUID,
          authorId: null,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('Query parameter validation', () => {
    it('should handle invalid status filter gracefully', async () => {
      const response = await unauthorizedRequest
        .get(`${articlesRoutes.getAll}?status=invalid_status`)
        .set(commonHeaders);

      expect([StatusCodes.OK, StatusCodes.BAD_REQUEST]).toContain(
        response.status,
      );
    });

    it('should handle invalid UUID in query parameters', async () => {
      const response = await unauthorizedRequest
        .get(`${articlesRoutes.getAll}?categoryId=not-a-uuid`)
        .set(commonHeaders);

      expect([StatusCodes.OK, StatusCodes.BAD_REQUEST]).toContain(
        response.status,
      );
    });

    it('should handle empty query string', async () => {
      const response = await unauthorizedRequest
        .get(`${articlesRoutes.getAll}?`)
        .set(commonHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
