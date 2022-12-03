FROM node:18-alpine AS development
# https://stackoverflow.com/questions/63724148/creating-react-application-for-production-with-docker-build
WORKDIR /usr/client
COPY package*.json ./

RUN npm install
EXPOSE 8080

COPY . ./

ARG REACT_APP_SERVER_DOMAIN
ENV REACT_APP_SERVER_DOMAIN $REACT_APP_SERVER_DOMAIN

# Run this command regardless so if prod is run, its cached
RUN npm run build

# production env (serve the build folder w/ nginx)
FROM nginx:1.15 AS production

ARG REACT_APP_SERVER_DOMAIN
ENV REACT_APP_SERVER_DOMAIN $REACT_APP_SERVER_DOMAIN

# Copies the nginx config in /nginx/nginx.conf which is set up to serve the html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copies the build folder to the nginx html folder, so the config can serve it
COPY --from=development /usr/client/build /usr/share/nginx/html
EXPOSE 8080
