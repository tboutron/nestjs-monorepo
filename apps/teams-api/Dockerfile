FROM node:18

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/teams-api

COPY apps/teams-api/package.json dist/apps/teams-api/
COPY apps/teams-api/tsconfig.build.json dist/apps/teams-api/
COPY apps/teams-api/tsconfig.json dist/apps/teams-api/

EXPOSE 3000

RUN yarn --cwd dist/apps/teams-api
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/teams-api -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd app start:teams-api:prd