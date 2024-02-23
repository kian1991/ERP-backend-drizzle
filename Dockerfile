# Stage 1: Build the image
FROM node:20 as builder
WORKDIR /app
COPY package*.json .
RUN npm ci
# Now do the build 
COPY . .
RUN npm run build

# Stage 2: Prod image
FROM node:alpine
WORKDIR /app
EXPOSE 5488
# copy the migrations
COPY --from=builder /app/db/migrations ./db/migrations
# Copy the built source files incl node_modules
COPY --from=builder /app/dist .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .


ENTRYPOINT node /app/db/migrate.js && node /app/db/inserts/insert.js && node /app/src/server.js




