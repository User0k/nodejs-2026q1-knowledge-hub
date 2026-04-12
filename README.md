# Knowledge Hub

A REST API platform for managing articles, categories, and comments built with NestJS and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v24.10.0 or higher) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** (comes with Node.js)
- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Docker** - [Download & Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** - Included with Docker Desktop

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
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=knowledge_hub
POSTGRES_PORT=5432
JWT_SECRET_KEY=your-secret-key-here
JWT_SECRET_REFRESH_KEY=your-refresh-secret-key-here
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
```

## 4. Docker Building and Running

#### Basic Setup

Build and run the application with a single command:

```bash
docker-compose up --build
```

#### Background Execution

Run in detached mode (background):

```bash
docker-compose up --build -d
```

#### Database Initialization

The database will be automatically created and migrated on first run. To reset the database:

```bash
docker-compose down -v
docker-compose up --build
```

#### Stopping Containers

```bash
docker-compose down
```

#### Removing Volumes

```bash
docker-compose down -v
```

#### Health Check Status

```bash
docker-compose ps
```

#### Production Considerations

The default setup is optimized for production with:

- Multi-stage builds
- Health checks
- Volume persistence for database data

[Link to uploaded image](https://hub.docker.com/repository/docker/user0k/knowledge-hub/general) on Docker Hub

The security scan report and commands for it can be found in `security-scan.md` file

## 5. Running Database

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Database Migrations

```bash
npx prisma migrate dev
```

#### Create New Migration

```bash
npx prisma migrate dev --name migration-name
```

#### Reset Database

```bash
npx prisma migrate reset
```

### Database Seeding

#### Run Database Seed

```bash
npx prisma db seed
```

This will create:

- Admin user
- Editor user
- Categories: Technology, Science, Health
- Tags: AI, Machine Learning, Programming, Health Tips, Research
- Sample articles with different statuses
- Sample comments

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

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/category`     | Get all categories    |
| GET    | `/category/:id` | Get category by ID    |
| POST   | `/category`     | Create a new category |
| PUT    | `/category/:id` | Update category       |
| DELETE | `/category/:id` | Delete category       |

### Articles

| Method | Endpoint       | Description                           |
| ------ | -------------- | ------------------------------------- |
| GET    | `/article`     | Get all articles (supports filtering) |
| GET    | `/article/:id` | Get article by ID                     |
| POST   | `/article`     | Create a new article                  |
| PUT    | `/article/:id` | Update article                        |
| DELETE | `/article/:id` | Delete article                        |

**Filtering Options** for `GET /article`:

- `status`: Filter by article status (`draft`, `published`, `archived`)
- `categoryId`: Filter by category UUID
- `tag`: Filter by tag name (can be repeated: `?tag=nodejs&tag=typescript`)

Example: `GET /article?status=published&tag=nodejs&categoryId=uuid`

### Comments

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/comment?articleId={id}` | Get comments for an article |
| POST   | `/comment`                | Create a new comment        |
| DELETE | `/comment/:id`            | Delete comment              |

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
