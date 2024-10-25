ARG repository
ARG php
FROM ${repository}${php}

ARG app
ENV app ${app}

ADD --chown=www-data:www-data . /var/www/html/${app}/

RUN cd /var/www/html/${app}/ \
    && cp nginx.conf /etc/nginx/conf.d/ \
    && cp run.sh /usr/local/

ENTRYPOINT /bin/sh /usr/local/run.sh
