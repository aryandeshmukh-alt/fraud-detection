# Fraud Detection Backend

This repository contains the **backend service** for the Fraud Detection system.  
It is written in **Go** and follows a **clean, modular architecture** suitable for production systems.

* * *

## Tech Stack

*   **Language:** Go (Golang)
    
*   **Web Framework:** net/http (standard library)
    
*   **Database:** PostgreSQL
    
*   **Message Broker:** RabbitMQ (optional / future use)
    
*   **Containerization:** Docker & Docker Compose
    
*   **Auth:** JWT
    
*   **Config Management:** Environment variables (`.env`)
    

* * *


## Prerequisites

Make sure the following are installed on your system.

### 1\. Go

Check if Go is installed:

`go version`

If not installed, download from:  
[https://go.dev/dl/](https://go.dev/dl/)

* * *

### 2\. Docker & Docker Compose

Check Docker:

`docker --version`

Check Docker Compose:

`docker compose version`

Docker is used to run **PostgreSQL** and **RabbitMQ** locally without manual setup.

* * *

## Environment Setup

### 1\. Create `.env` file

Inside the `backend/` directory:

`cd backend touch .env`

* * *

## Running the Backend (Without Docker)

This is useful for quick development.

### Step 1: Go to backend folder

`cd backend`

Why:

*   The app loads `.env` from the **current working directory**
    
*   Go module (`go.mod`) also lives here
    

* * *

### Step 2: Install dependencies

`go mod tidy`

Why:

*   Downloads required dependencies
    
*   Cleans unused packages
    
*   Ensures `go.sum` is correct
    

* * *

### Step 3: Run the server

`go run cmd/server/main.go`

Why:

*   `main.go` is the entry point
    
*   This starts the HTTP server
    

If successful, you should see logs like:

`Server started on port 8080 Connected to database`

* * *

## Running with Docker (Recommended)

Docker ensures:

*   Same setup for all developers
    
*   No local DB conflicts
    
*   Production-like environment
    

* * *

### Step 1: Start services

From `backend/`:

`docker compose up -d`

Why:

*   Starts PostgreSQL and RabbitMQ
    
*   `-d` runs containers in background
    

* * *

### Step 2: Verify containers

`docker ps`

You should see:

*   postgres container
    
*   rabbitmq container
    

* * *

### Step 3: Run backend server

`go run cmd/server/main.go`

The backend connects to Docker-running services.

* * *

### Step 4: Stop containers (when done)

`docker compose down`

Why:

*   Stops containers
    
*   Frees ports
    
*   Cleans resources
    

* * *

## Common Commands Summary

| Command | Purpose |
| --- | --- |
| go run cmd/server/main.go | Start backend server |
| go mod tidy | Manage dependencies |
| docker compose up -d | Start infra services |
| docker compose down | Stop infra services |
| docker ps | Check running containers |

