FROM node:latest

WORKDIR /src/
RUN git clone https://github.com/ton-link/ton-link-node-v4.git
WORKDIR /src/ton-link-node-v4
COPY .env .env
RUN npm install
RUN npm install tsc -g
RUN npm run build
CMD ["node", "index.js"]