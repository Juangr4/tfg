FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm ci
RUN npm run experimental-build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "run", "start"]