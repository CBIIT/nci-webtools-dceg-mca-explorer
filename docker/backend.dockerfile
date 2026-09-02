FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    gcc-c++ \
    make \
    nodejs \
    npm \
    R \
    && dnf clean all

# AL2023's nodejs/npm RPM bundles vulnerable transitive deps (tar, brace-expansion, etc.);
# replace npm in place with the latest release supporting this image's Node 18 runtime.
RUN npm install -g npm@10.9.9

RUN mkdir -p /deploy/server /deploy/logs

WORKDIR /deploy/server

# use build cache for npm packages
COPY server/package*.json /deploy/server/

RUN npm install

# copy the rest of the application
COPY . /deploy/

CMD npm start
