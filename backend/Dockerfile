FROM golang:1.19

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build
RUN go build -o /server cmd/server/main.go

EXPOSE 8080

# Run
CMD ["/server"]