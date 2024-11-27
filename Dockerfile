FROM node:18
WORKDIR /app
COPY package*.json ./
ENV PORT 8080
ENV MODEL_URL='https://storage.googleapis.com/model-cancer10/model-in-prod/model.json'
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]
