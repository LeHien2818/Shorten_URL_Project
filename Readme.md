# URL Shortener System

This is a URL Shortener system that uses microservices architecture, optimized for scalability and performance. The system utilizes Kafka for message queuing, Redis for caching, and PostgreSQL as the database. The system is deployed using Docker containers for easy management and scalability.

## Architecture

### Overview

The system is designed using **Microservices Architecture**, which helps in scaling individual components independently. The architecture also employs **Kafka's competing consumer pattern** for handling background tasks, such as updating the click count for URLs.

The **Load Leveling Pattern** is used to ensure that the load is evenly distributed across the system to prevent bottlenecks, especially when processing high volumes of requests.

#### Key Components:

- **Kafka**: Message Queue for handling background tasks (e.g., storing URL data and updating click counts).
- **Redis**: Cache for storing frequently accessed data, applying the **Cache-Aside** strategy to improve performance. Each request first checks Redis cache before querying the database.
- **PostgreSQL**: Database for persistent storage of URL mappings.
- **Docker**: Used for deploying all services in isolated environments, ensuring easy setup and scaling.

### Workflow

1. **Create Short URL**:
   - The client sends a request to create a short URL.
   - The server generates a hash code for the URL.
   - It checks if the hash code exists in the Redis cache:
     - If the hash is found, it returns the cached short URL.
     - If the hash is not found, the server stores the mapping in Redis and sends a message to Kafka to handle the background task of storing the URL in the database.
2. **Retrieve Original URL**:
   - The client sends a request to retrieve the original URL using a short URL.
   - The server checks the Redis cache for the short URL:
     - If found, it returns the original URL.
     - If not found, it checks the PostgreSQL database and returns the original URL if present.

### Optimizations

- **Kafka**: We use Kafka with the **Competing Consumer** pattern to handle tasks such as storing URL data and updating click counts asynchronously. This allows us to scale the processing of these tasks independently of the web service.
- **Redis Cache**: Implements the **Cache-Aside** pattern, where the application manages the cache. For each request, the system first checks Redis, and if the data is not available, it fetches from the database and stores it in Redis for future use.

### Docker Deployment

All services (URL Shortener, URL Expander, Database, Kafka, Redis) are deployed using Docker for easy setup and scalability. The services communicate via a custom Docker network.

To deploy the services using Docker, follow the steps below.

## Installation

### Prerequisites

- Docker
- Node.js
- npm

#### **Caution**: If you are using Ubuntu, you may need to run the folowing docker commands with _sudo_

### Step 1: Create Docker Network

Before starting the services, you need to create a Docker network to allow all services to communicate with each other.

```bash
docker network create url_shortener_network
```

### Step 2: Database:

#### This will start the database in the background.

1. Navigate to the database folder:

```bash
cd database
```

2. To start the PostgreSQL database:

```bash
docker-compose up -d
```

3. To stop the database and remove the container:

```bash
docker-compose down
```

### After start database, you need to start Redis Cache and Kafka

First go to server folder:

```bash
cd server/src
```

If you are in database folder, run this command:

```bash
cd ../server/src
```

### Step 3: Redis cache

The Cache-Aside pattern is used for caching. The system checks Redis for the short URL before querying the database. If the data is not present, it fetches from the database and stores it in Redis.

```bash
cd redis
docker compose up -d
```

### Step 4: Kafka Producer and Consumer

- Producer: The URL Shortener service sends messages to Kafka to trigger the background task for storing the short URL in the database.
- Consumer: The consumer service listens to Kafka topics, processes the messages, and updates the database.

```bash
cd ../kafka
docker compose up -d
```

### Step 5: Another services

1. Navigate to the url-expander and url-shortener folders, and run docker-compose up -d for each service:

```bash
cd url-expander
docker-compose up -d
cd ../url-shortener
docker-compose up -d
cd ../analytics
docker-compose up -d
```

### Step 6: Client

Go to **Client/frontend** folder and run this command:

```bash
npm i
npm run dev
```

## Conclusion

This URL Shortener system utilizes modern architectural patterns such as Microservices, Load Leveling, and Competing Consumer with Kafka. The system is designed to be scalable, with Redis for caching and PostgreSQL for data storage. Kafka helps with decoupling and background task processing, while Docker ensures smooth deployment and management.
