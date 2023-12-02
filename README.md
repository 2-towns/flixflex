# FlixFlex example

This project is a sample project using the TMDB database to display movies, series and favorites data.

# Install

Install npm dependencies:

```
npm install
```

Start Redis with Docker:

```
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

Copy the .env.example to .env and replace the `ACCESS_TOKEN` by your access token for `api.themoviedb.org`.

Start the server

```
npm run dev
```

# Technical choices

## Redis

Redis is used as database because of the easiness to install it and use it. It also provides super fast performances.

## HTMX

HTMX is for the frontend for two reasons:

- It reduces dramatically the frontend complexity: no need to build tools, hydratation...etc
- It is very easy to use for a backend developer

## Rest

The REST API is returning HTML to integrate with HTMX easily.
It is easily to create a JSON API, but it would complicate the work for nothing for this project.

The REST endpoints are:

- /login.html
- /favorites.html
- /logout.html

# Architecture

The code is organized into 4 layers:

- routes: The URL endpoints. A route calls a service to get data and then give this data to the view.
- services: The business logic layer.
- models: The database layer.
- views: The ui layer.

By keeping this architecture, it is easy to make changes in the code layers. For example, it is easy to move from Redis to another database like MongoDB for example.

# Enhancements

Here is a non exhaustive list that could be added to the application to improve it:

- Currently, when the user is not register, his account is automatically created and connected. Obviously, it's better to separate this two actions. A forgot password feature is also a must.
- To improve the security, it will be necessary to add strict csp policy and some headers for security like `X-XSS-Protection`
- Adding a loader for the button when a request is running would improve the UX.
- It is also better to write unit and functional tests with the node runner and `hurl`.
- Use a CI/CD with github actions is also a must for real projects.
