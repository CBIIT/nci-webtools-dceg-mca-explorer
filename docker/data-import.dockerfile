FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs \
    npm \
    awscli \
    && dnf clean all

RUN chmod 700 /usr/bin/python3.9

WORKDIR /app/database

COPY database/package.json /app/database/

RUN npm install

COPY database /app/database/

RUN chmod +x reimport-opensearch.sh docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]