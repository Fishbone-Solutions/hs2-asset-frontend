# -----------------------------
# 1) Build your frontend assets
# -----------------------------
FROM node:23.7.0-bullseye AS builder
WORKDIR /usr/src/app

# Copy package files first (for efficient caching of npm install)
COPY package*.json ./
RUN npm install

# Now copy the remaining source files
COPY . .
RUN npm run build

# -----------------------------
# 2) Production image with Nginx
# -----------------------------
FROM nginx:1.25-alpine

# Copy your custom NGINX config into /etc/nginx/conf.d/
# (We’ll update hs2.conf for HTTPS)
COPY hs2.conf /etc/nginx/conf.d/default.conf

# Copy build output from the builder
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/ ./

# --- Example ONLY: copy ECDSA cert & key into the container ---
# In production, mount them via secrets or volumes:
COPY ec-certificate.crt /etc/ssl/certs/
COPY ec-private.key /etc/ssl/private/

# Expose port 443 (TLS)
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
