FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "sh", "-c", "'npm i && npm run db && npm run dev'" ]