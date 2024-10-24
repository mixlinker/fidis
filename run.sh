#!/bin/sh

#nginx缓存区目录
mkdir /var/lib/nginx/tmp/client_body
chmod 777 -R /var/lib/nginx/
chmod 755 /usr/local/entrypoint.sh

chmod 666 /proc/self/fd/2
su www-data -c  '/usr/local/entrypoint.sh'

tail -f /var/log/nginx/error.log
/bin/sh
