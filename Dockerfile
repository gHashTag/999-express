FROM node:alpine
RUN apk add  --no-cache ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# docker build -t 999-express .  
# docker stop 999-express-container
# docker rm 999-express-container
# docker run -d -p 3000:3000 --name 999-express-container 999-express
