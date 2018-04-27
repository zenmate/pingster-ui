FROM node:9

#Pingster server api passed as optional argument
ARG pingster_api=localhost:8080
ARG on_port=3000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g serve

COPY . .

RUN REACT_APP_PINGSTER_API=$pingster_api npm run build

EXPOSE $on_port

CMD serve -s build -p $on_port
