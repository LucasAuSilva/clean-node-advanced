ARG PORT_BUILD=5050

FROM node:lts-alpine
WORKDIR /app/clean-node-advanced
ENV PORT=${PORT_BUILD}

EXPOSE $PORT

COPY ./env .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./src ./src

RUN npm install --omit=dev
RUN npm run build
RUN npx prisma migrate deploy

ENTRYPOINT npm start
