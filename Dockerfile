FROM node:20-alpine

ENV REVIEWDOG_VERSION=v0.17.0

WORKDIR /action

SHELL ["/bin/ash", "-eo", "pipefail", "-c"]

# hadolint ignore=DL3006
RUN apk --no-cache add git
RUN wget -O - -q https://raw.githubusercontent.com/reviewdog/reviewdog/master/install.sh| sh -s -- -b /usr/local/bin/ ${REVIEWDOG_VERSION}

COPY index.js .
COPY package.json .
COPY entrypoint.sh .

RUN chmod +x /action/entrypoint.sh
RUN npm install

ENTRYPOINT ["/action/entrypoint.sh"]
