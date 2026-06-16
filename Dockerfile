FROM node:20-alpine
LABEL authors="maria"
WORKDIR /app

COPY app/package*.json ./
RUN npm install
COPY app/ ./

EXPOSE 8000
CMD ["sh", "-c", "npm run migrate:up && npm start"]