FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libzip-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_mysql zip

RUN a2enmod rewrite \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# Belt-and-suspenders alongside the existing .htaccess php_value lines, in case a
# host ignores .htaccess overrides for these two directives specifically.
RUN { \
    echo 'upload_max_filesize=200M'; \
    echo 'post_max_size=200M'; \
    } > /usr/local/etc/php/conf.d/uploads.ini

# The existing storage/audio/.htaccess "Require all denied" rule would be silently
# shadowed if a persistent disk ever gets mounted at storage/ (the mount starts
# empty, hiding the file). A vhost-level Directory rule survives that regardless.
RUN { \
    echo '<Directory "/var/www/html/storage/audio">'; \
    echo '    Require all denied'; \
    echo '</Directory>'; \
    } > /etc/apache2/conf-available/deny-audio.conf \
    && a2enconf deny-audio

COPY api/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html/storage \
    && chmod -R 775 /var/www/html/storage

# Render (and most container hosts) inject $PORT at runtime and expect the
# container to listen on it — Apache's default config hardcodes port 80, so this
# has to be rewritten at container start, not at build time (env vars aren't
# available yet during `docker build`).
RUN printf '#!/bin/sh\nset -e\n: "${PORT:=80}"\nsed -ri "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf\nsed -ri "s/:80>/:$PORT>/" /etc/apache2/sites-enabled/000-default.conf\nexec apache2-foreground\n' \
    > /usr/local/bin/start-apache.sh \
    && chmod +x /usr/local/bin/start-apache.sh

EXPOSE 80
CMD ["/usr/local/bin/start-apache.sh"]
