# Containerized image in layered approach

# use node image from dockerhub (environment)
FROM node:22-alpine

# this will create a directory named app in the container
WORKDIR /app

# copy package.json and package-lock.json files to the working directory
COPY package.json ./
COPY package-lock.json ./

# install the dependencies
RUN npm install

# copy all the files from the current directory to the working directory    
COPY . .

# expose the port 5173
EXPOSE 5173

# start the application
CMD ["npm","run","dev"]