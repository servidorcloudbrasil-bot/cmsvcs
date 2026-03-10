#!/bin/bash

# Wait for DB, install, and start Apache



# Helper to log

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"; }



log "Starting entrypoint script..."



# 1. Run Automated Install

log "Initializing database and configuration..."

php /var/www/html/auto-install.php



# 2. Check if config exists

if [ -f "/var/www/html/config.php" ]; then

    log "Config successfully generated."

else

    log "Error: Failed to generate config.php."

fi



# 3. Start Apache in Foreground

log "Starting Apache..."

apache2-foreground