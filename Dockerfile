FROM node:16

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD [ "pnpm", "start"]
