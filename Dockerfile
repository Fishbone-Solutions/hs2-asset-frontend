# build environment
FROM node:23.7.0-bullseye AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

# production environment migrate
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist .
COPY hs2.conf /etc/nginx/conf.d/hs2.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
