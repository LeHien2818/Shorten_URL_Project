# Installation
Firstly, clone this repository to your local machine.

## Requirement:
Your machine need to have Docker, Node, and npm installed.

### Database

To install the database, you need to run the following commands in your terminal:

#### Step 1:
Navigate to db folder:
`cd db`
#### Step 2:
To start database: 
`docker-compose up -d` to run the database in the background.
If you want to shut down database server and delete container, just simply run:
`docker-compose down`.
#### Caution: If you use Linux OS, you should run above commands with sudo permission!
For instance,  `sudo docker-compose up -d` and `sudo docker-compose down`.

### Server

Navigate to url-expander and url-shortener in order to run npm install first which  will install all the dependencies required for the project.
Then, just simply run: `npm run dev` for each service.
To find more options: Read the script in package.json file