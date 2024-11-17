# Use a more recent Go version
FROM golang:1.23-alpine

WORKDIR /src/app

# Install a specific version of air
RUN go install github.com/cosmtrek/air@v1.40.4

# Copy application files
COPY . .

# Run the application
CMD ["air", "-c", ".air.toml"]
