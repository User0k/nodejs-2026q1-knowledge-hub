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

In order, you can run the server via

```bash
npm start
```

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

## API Documentation

### Users

| Method | Endpoint        | Description          | 
| ------ | --------------- | -------------------- | 
| GET    | `/user`         | Get all users        | 
| GET    | `/user/:id`     | Get user by ID       | 
| POST   | `/user`         | Create a new user    | 
| PUT    | `/api/user/:id` | Update user password | 
| DELETE | `/api/user/:id` | Delete user          | 

### Categories

| Method | Endpoint            | Description           | 
| ------ | ------------------- | --------------------- | 
| GET    | `/category`         | Get all categories    |
| GET    | `/category/:id`     | Get category by ID    | 
| POST   | `/category`         | Create a new category | 
| PUT    | `/category/:id`     | Update category       | 
| DELETE | `/category/:id`     | Delete category       | 

### Articles

| Method | Endpoint           | Description                           | 
| ------ | ------------------ | ------------------------------------- | 
| GET    | `/article`         | Get all articles (supports filtering) |
| GET    | `/article/:id`     | Get article by ID                     | 
| POST   | `/article`         | Create a new article                  | 
| PUT    | `/article/:id`     | Update article                        | 
| DELETE | `/article/:id`     | Delete article                        | 

**Filtering Options** for `GET /article`:

- `status`: Filter by article status (`draft`, `published`, `archived`)
- `categoryId`: Filter by category UUID
- `tag`: Filter by tag name (can be repeated: `?tag=nodejs&tag=typescript`)

Example: `GET /article?status=published&tag=nodejs&categoryId=uuid`

### Comments

| Method | Endpoint                      | Description                 | 
| ------ | ----------------------------- | --------------------------- | 
| GET    | `/comment?articleId={id}`     | Get comments for an article |
| POST   | `/comment`                    | Create a new comment        | 
| DELETE | `/comment/:id`                | Delete comment              | 

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
