# Project Name

A professional white-label [brief description of your software type] solution designed for [Entrepreneurs in the Pet-Services Industry]. Built with [key technologies] to provide scalable, customizable implementations for diverse business needs.

## Overview

[Project Name] is a comprehensive solution that helps businesses [solve specific problems/achieve specific goals]. Our platform offers:

- **Core Feature One**: Client management and scheduling
- **Core Feature Two**: Billing and payment processing
- **Core Feature Three**: Customer support and communication

[Project Name] is designed to be user-friendly, secure, and scalable, ensuring that businesses can [achieve their goals] with ease and efficiency.

## Technology Stack

- Backend: [[Node.js](https://nodejs.org/en/), [Hono](https://hono.dev/) in TypeScript]
- Frontend: [[React](https://reactjs.org/) w/ [Next.js](https://nextjs.org/)]
- Database: [PostgreSQL, [Supabase Auth](https://supabase.com/auth)]
- Infrastructure: [[Docker](https://www.docker.com/)]
- Testing: [[Vitest](https://vitest.dev/)]

## Project Structure

```
paws-harbor/
├── app/web/                        # Next.js Client
├── app/api/                        # HonoJS Server
├── @repo/ui/                       # React Component Library (future refactor from app/web)
├── @repo/logger/                   # Isomorphic Logger
├── @repo/eslint-config/            # ESLint Configuration
└── @repo/typescript-config/        # tsconfig.json's used in monorepo
```

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- [Requirement 1] node version >= 14.0.0
- [Requirement 2] pnpm version = 9.0.4
- [Requirement 3] docker

### Installation

1. Clone the repository

```bash
git clone https://github.com/t-murch/paws-harbor.git
cd paws-harbor
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment

```bash
cp apps/api/.env.example .env
cp apps/web/.env.local.example .env.local
# Edit .env with your configuration
```

4. Run the application

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open <http://localhost:3000>.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test -- --suite=core
```

## Contributing

While this is a proprietary project, I welcome feedback and discussions through issues. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting any issues.

## License

This project is licensed under a BSD-3-Clause license - see the [LICENSE](LICENSE) file for details.

## Contact & Support

- **Email**: [t.murchjr@gmail.com]
- **Issues**: [GitHub Issues Link]
- **Documentation**: [Documentation Link]

## Roadmap

- [x] Booking Services implementation
- [x] Service Notifications implementation
- [ ] Client Management implementation
- [ ] Realtime mapping of walking services.

---

© [2025] [Todd Murchison Jr.]. All rights reserved.

<!-- ## Configuration -->
<!---->
<!-- The system can be configured through: -->
<!---->
<!-- - Environment variables -->
<!-- - Configuration files -->
<!-- - API endpoints -->
<!---->
<!-- Key configuration options: -->
<!---->
<!-- - `OPTION_ONE`: Description of what this configures -->
<!-- - `OPTION_TWO`: Description of what this configures -->
<!---->
<!-- ## Documentation -->
<!---->
<!-- - [API Documentation](docs/api.md) -->
<!-- - [Configuration Guide](docs/configuration.md) -->
<!-- - [Deployment Guide](docs/deployment.md) -->
<!-- - [Client Implementation Guide](docs/client-implementation.md) -->
<!---->
<!---->
