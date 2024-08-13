# # build environment
# FROM node:gallium-buster-slim AS builder
# WORKDIR /usr/src/app
# COPY . .
# RUN npm install
# RUN npm install ajv --save-dev
# RUN npm run build

# # production environment
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# COPY --from=builder /usr/src/app/build .
# COPY hs2.conf /etc/nginx/conf.d/hs2.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Use an official Nginx image as the base image
FROM nginx:alpine

# Copy the built React app to Nginx's serve directory
COPY build/ /usr/share/nginx/html
COPY hs2.conf /etc/nginx/conf.d/hs2.conf

# Copy a custom Nginx configuration file (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
