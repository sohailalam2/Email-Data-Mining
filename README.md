# Email Data Mining
===================

This project showcases the following features/technologies:

- Connect to an IMAP email provider like gmail and process emails
- Static HTTP server
- ES7 Features like async/await
- Running ES7 without transpilation, natively on NodeJS version > 7.7.0
- Ava unit tests - async unit tests and synchronous unit tests
- Code Coverage Report generation using Nyc (Istanbul)
- Generating JS Docs using jsdoc
- Gulp
- Docker
- Yarn package manager

## Prerequisites

- NodeJS version **7.7.0** or more (needed only for development)
- Docker version **1.13.0** or more (needed only for running the app in docker container)

### Environment Variables

The app takes into account three environment variables:

- IMAP_USERNAME The email username (mandatory, no defaults)
- IMAP_PASSWORD The email password (mandatory, no defaults)
- PORT The port on which the HTTP server runs (defaults to 8080)

## Installation & Running

The best way to install and run the app is to use docker

### Docker Build

_Notice the dot (.) at the end of the docker build command_

```sh
docker build -t sohail/example:v1 .
```

### Run Docker Container

It is important to run the container in interactive mode, to see the unit test results and the
results from the email stats processor.

```sh
docker run -it --rm -p 127.0.0.1:8080:8080 -e IMAP_USERNAME=<YOUR_USERNAME> -e IMAP_PASSWORD=<YOUR_USERNAME> sohail/example:v1
```

**NOTE:**
Remember to replace YOUR_USERNAME and YOUR_USERNAME above with real values.

Once you run the app, you will see the email statistics on console and you can visit http://localhost:8080/ on your browser,
to see the code coverage results and source code documentations.


## Development & Testing

Alternative to docker is to install NodeJS 7.0.0 or more on your computer and run the application.

### Installation

Install Yarn package manager and install project dependencies

```sh
npm install -g yarn && yarn
```

### Test and Build Documentation

Run Ava unit tests and generate test coverage reports and source code documentations.

```sh
gulp
```

### Running the app

Start the application

```sh
cd src/ && node index
```
