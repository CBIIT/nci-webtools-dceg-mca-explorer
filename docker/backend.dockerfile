# Stage 1: install deps and assemble the app. node_modules (and npm's own
# vendored transitive deps, e.g. brace-expansion, postcss-selector-parser,
# ip-address) never leave this stage.
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

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install


# copy the rest of the application
COPY . /deploy/

# Stage 2: runtime image. Only the Node.js runtime, R (for fisher_test.R),
# and the already-installed app/node_modules are present; npm itself (and
# its vendored CLI dependencies) is removed since the app is started with
# `node` directly, never `npm start`.
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs24 \
    R \
    shadow-utils \
    && dnf clean all \
    && rm -rf /usr/lib/nodejs24/lib/node_modules/npm

RUN chmod 700 /usr/bin/python3.9

# CIS Docker Benchmark 4.1: run as a non-root user. Port 9000 is unprivileged,
# so no extra capabilities are needed to bind it.
RUN groupadd -r backend-app \
   && useradd -r -g backend-app -d /deploy -s /sbin/nologin backend-app

COPY --from=build --chown=backend-app:backend-app /deploy /deploy

WORKDIR /deploy/server

USER backend-app

CMD ["node", "-r", "dotenv/config", "server.js"]
