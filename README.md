# Project Setup


This is a NestJS application using Sequelize as the ORM and MySQL as the database. The project is set up to run in a Docker environment.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/get-npm)

## Getting Started

### Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>


## Environment Variables
Create a `.env` file in the root directory of the project and add the following environment variables:

```
# Example environment variables
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
PORT=5000
```

## Docker Setup
Make sure Docker and Docker Compose are installed on your machine. To set up the Docker containers, run:

```sh
docker-compose up -d
```

This command will start three services:
- **nest_db**: MySQL database
- **phpmyadmin**: A web interface for managing the MySQL database
- **nest_app**: The NestJS application

## Install Dependencies
If you prefer to run the application outside of Docker, you can install the dependencies using npm:

```sh
npm install
```

## Running the Application
To start the application in development mode, run:

```sh
npm run start:dev
```

The application will be available at [http://localhost:5000](http://localhost:5000).

## Running Migrations
To run database migrations, use the following command:

```sh
npm run migrate
```

## Running Tests
To run the tests, use the following command:

```sh
npm test
```

## Project Structure
```
📂 src/                     # Source code of the application
 ├── 📄 app.controller.ts    # Main controller
 ├── 📄 app.module.ts        # Main module
 ├── 📄 app.service.ts       # Main service
 ├── 📂 core/               # Core modules and utilities
 ├── 📂 dao/                # Data Access Objects
 ├── 📂 dto/                # Data Transfer Objects
 ├── 📂 models/             # Sequelize models
 ├── 📂 user/               # User module
📂 config/                  # Configuration files
📂 db/                      # Database migrations and seeders
📂 lib/                     # Helper functions
📂 test/                    # End-to-end tests
```


