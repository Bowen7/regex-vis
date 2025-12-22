FROM node:18 AS builder

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

RUN pnpm set registry https://nexus.helllord77.duckdns.org/repository/npm-proxy/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

FROM nginx:alpine

# Copy the built application
COPY --from=builder /app/dist /usr/share/nginx/html
