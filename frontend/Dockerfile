FROM node:18-alpine

WORKDIR /app

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Create required directories and set permissions
RUN mkdir -p /app/.next && \
    touch /app/next-env.d.ts && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app && \
    chmod 777 /app/next-env.d.ts && \
    chmod -R 777 /app/.next

USER nextjs

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV NODE_ENV development

# Development-specific settings
CMD ["npm", "run", "dev"]
