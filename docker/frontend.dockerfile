FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
   && dnf -y install \
   gcc-c++ \
   httpd \
   make \
   nodejs \
   npm \
   && dnf clean all

RUN mkdir /client

WORKDIR /client

COPY client/package*.json /client/
COPY client/patches /client/patches

RUN npm install --force

COPY client /client/

ARG APPLICATION_PATH=/
ARG REACT_APP_VERSION=dev
ARG REACT_APP_LAST_UPDATED=unknown

ENV APPLICATION_PATH=${APPLICATION_PATH}
ENV REACT_APP_VERSION=${REACT_APP_VERSION}
ENV REACT_APP_LAST_UPDATED=${REACT_APP_LAST_UPDATED}

RUN npm run build \
   && mkdir -p /var/www/html/${APPLICATION_PATH} \
   && cp -r /client/build/* /var/www/html/${APPLICATION_PATH}

WORKDIR /var/www/html

# Add custom httpd configuration
COPY docker/frontend.conf /etc/httpd/conf.d/frontend.conf

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
   && exec /usr/sbin/httpd -DFOREGROUND