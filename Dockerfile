# Build Stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM php:8.3-apache

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Update Apache config for .htaccess
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Copy built assets from build stage
COPY --from=build /app/dist /var/www/html/

# Copy Files
COPY install.php auto-install.php entrypoint.sh .htaccess /var/www/html/

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod +x /var/www/html/entrypoint.sh

# Use entrypoint
ENTRYPOINT ["/var/www/html/entrypoint.sh"]

EXPOSE 80
