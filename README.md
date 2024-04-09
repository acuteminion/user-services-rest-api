<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS User Management System

This project is built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. It leverages RabbitMQ for message queuing and handles user registration, authentication, and avatar management with an emphasis on interaction with external APIs and local file and data management.

## Prerequisites

- Node.js version 20.11
- RabbitMQ
- NestJS (Make sure to have the Nest CLI installed globally)
- A MongoDB for storing user data and avatars in base64 format.

## Installation

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/sunoul41/user-services-rest-api.git
   ```

2. Navigate into the project directory.

   ```bash
   cd user-services-rest-api
   ```

3. Install the dependencies.

   ```bash
   npm install
   ```
   
4. Ensure RabbitMQ is running on your local environment.

5. Copy `.env.example` to `.env` and update the environment variables to match your local setup, including RabbitMQ and database credentials.

## Features

### User Registration

- Registers a new user with the required details.
- Sends a success email to the user upon registration.
- Publishes an event to RabbitMQ indicating the successful registration of a user.

### Get User by ID

- Retrieves a user by their ID from an external API (https://reqres.in).
- The response includes the user's details.

### User Avatar Management

- Gets the user's avatar from an external API and saves it to the database in base64 format.
- Saves the avatar on the server as a plain file.
- Sends the avatar data in base64 format to the client upon request.
- Deletes the user's avatar from the database and also deletes the corresponding plain file from the server.


## Running the Application

To start the application, run:

    npm run start

For development, you can watch for changes and automatically reload the server using:

    npm run start:dev

## API Endpoints

- POST **/users** - Registers a new user.
- GET **/users/{id}** - Retrieves a user by ID from an external API.
- GET **/users/avatar/{id}** - Retrieves a user's avatar in base64 format.
- DELETE **/users/avatar/{id}** - Deletes a user's avatar from the database and server.
