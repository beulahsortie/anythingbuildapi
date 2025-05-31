#use the offical node.js image
FROM --platform=linux/amd64 node:14

#set the working directory in the container
WORKDIR /usr/src/app

#install dependencies
COPY package.json ./
RUN npm install

#Copy the rest of the application code
COPY . .

#Expose the backend port
EXPOSE 8800

CMD ["npm", "start"]