FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    gcc-c++ \
    make \
    nodejs24 \
    R \
    && dnf clean all

# AL2023 ships versioned Node packages; nodejs24 provides Node 24.x and its own bundled npm.
# That bundled npm still vendors vulnerable transitive deps (tar, brace-expansion, etc.);
# replace it with the latest release compatible with this image's Node 24.14.0 (npm@latest
# requires Node >=24.15.0, one minor newer than what nodejs24 currently provides).
RUN node -v && npm -v
RUN npm install -g npm@11.19.1

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install

# copy the rest of the application
COPY . /deploy/

CMD npm start
