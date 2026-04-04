# Knowledge Hub

A REST API platform for managing articles, categories, and comments built with NestJS and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22.14.0 or higher) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** or **pnpm** - Comes with Node.js
- **Git** - [Download & Install Git](https://git-scm.com/downloads)

## Installation

### 1. Clone the Repository and checkout to the corresponding branch

```bash
git clone https://github.com/User0k/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub

# for nestjs branch
git checkout nestjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it for your needs:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred text editor:

```env
PORT=4000
CRYPT_SALT=10
JWT_SECRET_KEY=your-secret-key-here
JWT_SECRET_REFRESH_KEY=your-refresh-secret-key-here
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
```

## Running the Application

### Development Mode

Run the application with hot-reload for development:

```bash
npm run start:dev
```

### Production Mode

Build and run the optimized production version:

```bash
npm run build
npm run start:prod
```

### Debug Mode

Run with debugging enabled:

```bash
npm run start:debug
```

### Accessing the Application

Once the server is running (default port: 4000), you can access:

- **API Base URL**: `http://localhost:4000`
- **OpenAPI/Swagger Documentation**: `http://localhost:4000/doc/`

The Swagger UI provides interactive documentation where you can test API endpoints directly from your browser.

## API Documentation

### Base URL

All API endpoints are prefixed with `/api`

### Authentication

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/auth/signup`  | Register a new user               |
| POST   | `/api/auth/login`   | Login and receive JWT tokens      |
| POST   | `/api/auth/refresh` | Refresh access and refresh tokens |

### Users

| Method | Endpoint        | Description          | Access         |
| ------ | --------------- | -------------------- | -------------- |
| GET    | `/api/user`     | Get all users        | Authenticated  |
| GET    | `/api/user/:id` | Get user by ID       | Authenticated  |
| POST   | `/api/user`     | Create a new user    | Admin only     |
| PUT    | `/api/user/:id` | Update user password | Owner or Admin |
| DELETE | `/api/user/:id` | Delete user          | Admin only     |

### Categories

| Method | Endpoint            | Description           | Access        |
| ------ | ------------------- | --------------------- | ------------- |
| GET    | `/api/category`     | Get all categories    | Authenticated |
| GET    | `/api/category/:id` | Get category by ID    | Authenticated |
| POST   | `/api/category`     | Create a new category | Admin only    |
| PUT    | `/api/category/:id` | Update category       | Admin only    |
| DELETE | `/api/category/:id` | Delete category       | Admin only    |

### Articles

| Method | Endpoint           | Description                           | Access         |
| ------ | ------------------ | ------------------------------------- | -------------- |
| GET    | `/api/article`     | Get all articles (supports filtering) | Authenticated  |
| GET    | `/api/article/:id` | Get article by ID                     | Authenticated  |
| POST   | `/api/article`     | Create a new article                  | Editor/Admin   |
| PUT    | `/api/article/:id` | Update article                        | Owner or Admin |
| DELETE | `/api/article/:id` | Delete article                        | Admin only     |

**Filtering Options** for `GET /api/article`:

- `status`: Filter by article status (`draft`, `published`, `archived`)
- `categoryId`: Filter by category UUID
- `tag`: Filter by tag name (can be repeated: `?tag=nodejs&tag=typescript`)

Example: `GET /api/article?status=published&tag=nodejs&categoryId=uuid`

### Comments

| Method | Endpoint                      | Description                 | Access         |
| ------ | ----------------------------- | --------------------------- | -------------- |
| GET    | `/api/comment?articleId={id}` | Get comments for an article | Authenticated  |
| POST   | `/api/comment`                | Create a new comment        | Editor/Admin   |
| DELETE | `/api/comment/:id`            | Delete comment              | Owner or Admin |

### Data Models

#### User

```json
{
  "id": "uuid",
  "login": "string",
  "role": "admin | editor | viewer",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Article

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "status": "draft | published | archived",
  "authorId": "uuid | null",
  "categoryId": "uuid | null",
  "tags": ["string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Category

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string"
}
```

#### Comment

```json
{
  "id": "uuid",
  "content": "string",
  "articleId": "uuid",
  "authorId": "uuid | null",
  "createdAt": "timestamp"
}
```

## Testing

> [!NOTE]  
> Run the server before running any tests!

### Run All Tests (Without Authorization)

```bash
npm run test
```

### Run Tests With Authorization

```bash
npm run test:auth
```

### Run Specific Test Suites

**Refresh Token Tests:**

```bash
npm run test:refresh
```

**RBAC (Role-Based Access Control) Tests:**

```bash
npm run test:rbac
```

### Run Tests with Coverage

```bash
npm run test:cov
```

## Code Quality

### Linting

Run ESLint with auto-fix:

```bash
npm run lint
```

### Formatting

Format code with Prettier:

```bash
npm run format
```
