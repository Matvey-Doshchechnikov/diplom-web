FROM node:22

WORKDIR /app

COPY frontend/courses-front/package*.json ./

RUN npm install --legacy-peer-deps

COPY frontend/courses-front ./

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
