FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create scripts directory
RUN mkdir /app/scripts

# Copy the start script into the scripts directory and set permissions
COPY scripts/start.sh /app/scripts/start.sh
RUN chmod +x /app/scripts/start.sh

# Copy the rest of the application
COPY . .

CMD ["/app/scripts/start.sh"]
