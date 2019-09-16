# Homeday GitHub Stats - Frontend

This is the frontend part of the [Homeday GitHub Stats](http://github-stats.homeday.dev) app. Documentation covers all of the deployment requirements.

## Systems involved
- [GitHub](https://github.com)
- [AWS S3](https://aws.amazon.com/s3)
- [Travis](https://travis-ci.com)
- [Auth0](https://auth0.com)

## Setup

It is recommended to set up the [backend part](https://github.com/homeday-de/homeday-github-stats-backend) of this guide first.

### Travis
There are two parts to the Travis config, `.travis.variables.sh` file in this repo where we set some variables based on the environment (there you will want to change your S3 bucket and lambda urls), and the configuration of the repository.

You will need the following list of environment variables defined in the repo settings of the Travis APP:
- `AUTH0_CLIENT_ID`: Public, Client ID of your Auth0 "SINGLE PAGE APPLICATION" app
- `AUTH0_DOMAIN`: Public, probably the same as AUTH0_BACKEND_DOMAIN unless you used two separate Auth0 accounts
- `AWS_ACCESS_KEY_ID`: Private, access key of the AWS account with permissions to write to S3
- `AWS_SECRET_ACCESS_KEY`: Private, secret access key of the AWS account with permissions to write to S3

### Useful `npm` commands

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

## How it works
Authentication is performed with Auth0. Once authenticated, a lis tof repositories is requested from the lambda backend. Once the repositories and the time range are selected, a request is sent to the lambda to analyze them. Lambda quickly responds with the path on our S# bucket where the results will be made available publicly. We then poll that path until the results show up (in the form of a JSON file), after which we display them on the frontend.
