FROM golang:1.19

# Set destination for COPY
WORKDIR /app

ENV GO111MODULE=on 

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /server cmd/server/main.go

EXPOSE 8080

# Run
CMD ["/server"]