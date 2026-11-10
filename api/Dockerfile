FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["sh", "-c", "npm run migrate && npm start"]
