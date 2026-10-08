# Stage 1: build the static assets. node_modules (and its build-tool-only
# transitive deps, e.g. html-minifier-terser) never leave this stage.
FROM public.ecr.aws/amazonlinux/amazonlinux:2023 AS build

RUN dnf -y update \
   && dnf -y install \
   gcc-c++ \
   make \
   nodejs24 \
   && dnf clean all

RUN chmod 700 /usr/bin/python3.9
# AL2023 ships versioned Node packages; nodejs24 provides Node 24.x and its own bundled npm.
# That bundled npm still vendors vulnerable transitive deps (tar, brace-expansion, etc.);
# replace it with the latest release compatible with this image's Node 24.14.0 (npm@latest
# requires Node >=24.15.0, one minor newer than what nodejs24 currently provides).
RUN node -v && npm -v
RUN node -v | grep -qE '^v24\.' && npm install -g npm@11.19.1

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

# Stage 2: runtime image. Only compiled static assets and httpd are present;
# no Node.js, npm, or node_modules ship in the final image.
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
   && dnf -y install \
   httpd \
   libcap \
   shadow-utils \
   && dnf clean all \
   && setcap 'cap_net_bind_service=+ep' /usr/sbin/httpd

RUN chmod 700 /usr/bin/python3.9

# CIS Docker Benchmark 4.1: run as a non-root user. setcap above lets this
# unprivileged user still bind to port 80.
RUN groupadd -r httpd-app \
   && useradd -r -g httpd-app -d /var/www/html -s /sbin/nologin httpd-app \
   && chown -R httpd-app:httpd-app /etc/httpd /var/log/httpd /run/httpd

COPY --from=build --chown=httpd-app:httpd-app /var/www/html /var/www/html

WORKDIR /var/www/html

# Add custom httpd configuration
COPY --chown=httpd-app:httpd-app docker/frontend.conf /etc/httpd/conf.d/frontend.conf

USER httpd-app

EXPOSE 80
EXPOSE 443

CMD rm -rf /run/httpd/* /tmp/httpd* \
   && exec /usr/sbin/httpd -DFOREGROUND