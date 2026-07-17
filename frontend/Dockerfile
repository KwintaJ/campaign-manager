FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm run build

COPY . .

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host"]