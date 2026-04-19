FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN GOOS=linux go build -o main .
FROM alpine:latest

RUN adduser -D user
USER user

WORKDIR /home/user

COPY --from=builder /app/main .

COPY --from=builder /app/sql/schema ./sql/schema


EXPOSE 8080

CMD ["./main"]