#!/bin/bash

if [ "$TRAVIS_BRANCH" = "develop" ]
  then
    echo "Running STAGING build"

    export ENV=staging
    export API_FETCH_REPOSITORIES_URL=https://ljq66i6ig8.execute-api.eu-central-1.amazonaws.com/dev/github/repositories
    export API_ANALYZE_URL=https://ljq66i6ig8.execute-api.eu-central-1.amazonaws.com/dev/github/analyze
    export DEPLOYMENT_S3_BUCKET=github-stats.staging.homeday.dev
fi

if [ "$TRAVIS_BRANCH" = "master" ]
  then
    echo "Running PRODUCTION build"

    export ENV=production
    export API_FETCH_REPOSITORIES_URL=https://qt4uy4o2ri.execute-api.eu-central-1.amazonaws.com/production/github/repositories
    export API_ANALYZE_URL=https://qt4uy4o2ri.execute-api.eu-central-1.amazonaws.com/production/github/analyze
    export DEPLOYMENT_S3_BUCKET=github-stats.homeday.dev
fi
