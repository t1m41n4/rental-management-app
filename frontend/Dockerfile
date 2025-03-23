FROM node:18-alpine

WORKDIR /app

# Add package management files
COPY package*.json ./

# Install dependencies with clean slate
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application
COPY . .

# Set correct permissions
RUN chown -R node:node /app
USER node

# Create .next directory with correct permissions
RUN mkdir -p .next

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV NODE_ENV development

CMD ["npm", "run", "dev"]
