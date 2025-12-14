# AI Blog

An AI-powered blog platform that automatically generates blog posts daily using OpenRouter AI. Built with a modern tech stack featuring React frontend, Express backend, PostgreSQL database, and Caddy reverse proxy.

## Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         Caddy (Reverse Proxy)                   │
│                        Port 80/443                              │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
                    │ /api/*                    │ /*
                    ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────────┐
│        Backend            │   │          Frontend             │
│     (Express + Node.js)   │   │     (React + Vite + Nginx)    │
│        Port 3000          │   │          Port 3001            │
└───────────────────────────┘   └───────────────────────────────┘
                    │
                    ▼
┌───────────────────────────┐
│        PostgreSQL         │
│        Port 5432          │
└───────────────────────────┘
```

## Features

### CI/CD Pipeline

The project uses AWS CodeBuild for continuous integration and Watchtower for continuous deployment.
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │───▶│  CodeBuild  │───▶│   AWS ECR   │───▶│ Watchtower  │
│   (Push)    │    │  (Build)    │    │  (Registry) │    │  (Deploy)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### Build Pipeline (`buildspec.yml`)

| Phase | Description |
|-------|-------------|
| **Install** | Verify Docker installation and dependencies |
| **Pre-build** | Authenticate with AWS ECR, generate image tag from commit SHA |
| **Build** | Build Docker images for frontend and backend |
| **Post-build** | Push images to ECR with `latest` and commit-specific tags |

#### Image Tagging Strategy

Each build produces two tags per image:
- `latest` - Always points to the most recent build
- `<commit-sha>` - First 7 characters of the Git commit hash for versioning

#### Deployment Flow

1. **Push to GitHub** → Triggers AWS CodeBuild via webhook
2. **CodeBuild** → Builds and pushes Docker images to ECR
3. **Watchtower** → Polls ECR every 30 seconds for new images
4. **Auto-deploy** → Watchtower pulls new images and restarts containers with zero downtime

#### Used AWS Resources

- **CodeBuild Project**: Configured with GitHub source and `buildspec.yml`
- **ECR Repositories**: `aiblog/frontend` and `aiblog/backend`
- **IAM Role**: CodeBuild role with ECR push permissions
- **EC2 Instance**: Running Docker with ECR credentials configured for Watchtower

### Components

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 19, Vite, TailwindCSS, React Router | Modern SPA with dark/light theme support, markdown rendering |
| **Backend** | Express 5, TypeScript, Drizzle ORM | RESTful API with scheduled blog generation via cron (daily at midnight UTC) |
| **Database** | PostgreSQL 16 | Persistent storage for blog posts |
| **Reverse Proxy** | Caddy 2 | Automatic HTTPS, request routing |
| **AI Integration** | OpenRouter API | AI-powered blog content generation |


### Automated Blog Generation

The backend includes a **cron job that runs daily at midnight (00:00 UTC)** to automatically generate new blog posts using the OpenRouter AI API. This ensures fresh content is added to the blog every day without manual intervention.


### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blog posts |
| GET | `/api/blogs/:id` | Get a specific blog post |
| POST | `/api/blogs/generate` | Manually trigger blog post generation, can send {"topic": "some topic"} payload to specify generation topic  |
| GET | `/health` | Health check endpoint |


## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18+) - for local development without Docker

## Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ziad-I/AI-Blog-Assessment.git
cd AI-Blog-Assessment
```

### 2. Configure environment variables

Create a `.env` file in the `backend` directory:
```bash
# backend/.env
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
```

### 3. Start development environment
```bash
docker compose -f docker-compose.dev.yml up --build
```

This will start:
- **Frontend**: http://localhost (via Caddy) or http://localhost:3001 (direct)
- **Backend API**: http://localhost/api (via Caddy) or http://localhost:3000 (direct)
- **PostgreSQL**: localhost:5432


### Running without Docker (Local Development)

**Remember** to set the env variables defined in `.env.example` in the `frontend` and `backend` directories

**Backend:**
```bash
cd backend
npm install
npm run db:migrate  # Apply database migrations
npm run dev      # Start with hot reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Environment Variables

Create a `.env` file in the project root with the following variables:
```bash
# AWS ECR Configuration
ACCOUNT_ID=your_aws_account_id
AWS_REGION=your_aws_region
BACKEND_REPOSITORY=your_ecr_backend_repo
FRONTEND_REPOSITORY=your_ecr_frontend_repo
TAG=latest

# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=your_db_name

# Application Configuration
DOMAIN=https://yourdomain.com

# OpenRouter Configuration
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
```

### Deploy with Docker Compose
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Production Features

- **AWS ECR**: Container images pulled from AWS Elastic Container Registry
- **Watchtower**: Automatic container updates when new images are pushed
- **Caddy**: Automatic HTTPS certificate management
- **Health Checks**: All services include health checks for reliability

### Important: Watchtower ECR Authentication

For Watchtower to authenticate with AWS ECR, this project uses the `docker-ecr-credential-helper`. **Critical setup notes:**

1. **Build from Source Required**: The credential helper must be built from source and cannot be installed via package managers when used with Watchtower.

2. **External Volume Configuration**: The compiled `docker-credential-ecr-login` executable must be:
   - Stored in an external Docker volume named `helper`
   - Mounted into Watchtower at `/go/bin/docker-credential-ecr-login`


3. **Watchtower Configuration**: The `docker-compose.prod.yml` includes:
   - external volume mount: `helper:/go/bin`
   - Environment variable: `PATH=/go/bin:$PATH`
   - Docker config path: `~/.docker/config.json`

Please refer to the following references to understand more:

**References:**
- [Watchtower Private Registries Documentation](https://containrrr.dev/watchtower/private-registries/#example)
- [Watchtower Issue #2116 (Credential helpers Dockerfile example not working (Go version problem)](https://github.com/containrrr/watchtower/issues/2116)


## Project Structure
```
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express app entry point
│   │   ├── config/            # Configuration (database, logger, cron)
│   │   ├── controllers/       # Request handlers
│   │   ├── db/schema/         # Drizzle ORM schema
│   │   ├── jobs/              # Cron job handlers (daily midnight UTC)
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routers/           # API routes
│   │   └── services/          # Business logic
│   ├── drizzle/               # Database migrations
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities and API client
│   │   ├── pages/             # Page components
│   │   └── providers/         # Provider components
│   └── Dockerfile
│   └── ngnix.conf             # nginx config to serve built files
├── docker-compose.dev.yml     # Development environment
├── docker-compose.prod.yml    # Production environment
├── Caddyfile                  # Caddy reverse proxy configuration
└── buildspec.yml              # AWS CodeBuild specification
```


## Useful Commands

### Database Management
```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (dev only)
npm run db:push
```

### Manual Blog Generation
```bash
# Trigger a new blog post generation manually
curl http://localhost/api/blogs/generate
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.