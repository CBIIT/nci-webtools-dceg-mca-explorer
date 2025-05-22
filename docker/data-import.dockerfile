FROM public.ecr.aws/amazonlinux/amazonlinux:2022

RUN dnf -y update \
    && dnf -y install \
    nodejs \
    npm \
    && dnf clean all

RUN mkdir -p /app/database

WORKDIR /app/database



RUN npm install

