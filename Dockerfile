# Use Bun slim image (Debian-based for easy APT)
FROM oven/bun:slim as base

# Set working directory
WORKDIR /app

# Install g++ and other minimal deps
RUN apt-get update && \
    apt-get install -y g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user for execution safety
RUN useradd -m runner
USER runner

# Copy only the files needed for installing deps
COPY package.json tsconfig.json ./

# Install production dependencies only
RUN bun install --production

# Copy the rest of the source code
COPY . .

# Expose Elysia/Bun port
EXPOSE 3000

# Start the app
CMD ["bun", "start"]
