# docker run -p 5000:5000 -d zenmate/pingster-ui

FROM node:9

WORKDIR /usr/src/app

ARG pingster_api='http://localhost:8080'

COPY package*.json ./

RUN npm install
RUN npm install -g serve

COPY . .

RUN REACT_APP_PINGSTER_API=$pingster_api npm run build

EXPOSE 5000

CMD serve -s build
