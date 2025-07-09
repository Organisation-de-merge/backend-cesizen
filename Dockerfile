FROM node:24-alpine3.21 as api

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 2323

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

ENTRYPOINT [ "entrypoint" ]
CMD ["node", "dist/src/main.js"]