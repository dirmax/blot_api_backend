FROM node:16-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN ls -la

RUN yarn install

# Exports
EXPOSE 3000
CMD [ "yarn", "run", "start" ]
