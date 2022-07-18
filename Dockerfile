FROM node:lts-alpine
WORKDIR /app/clean-node-advanced

COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./src ./src

RUN npm install --omit=dev
RUN npm run build

ENTRYPOINT npm start
