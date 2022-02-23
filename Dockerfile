FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]