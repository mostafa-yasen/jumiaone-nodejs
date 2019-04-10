FROM node:8.12.0-alpine
  
LABEL maintainer="Jumia SRE MDS <sre.mds@jumia.com>"

ENV LINUX alpine
ENV APP reliabilityservice

RUN apk add --no-cache --force-refresh \
            curl \
            net-tools \
            lsof \
            vim \
            curl \
            wget \
            tcpdump

# Create applicatin folder and adjust persmissions
RUN mkdir -p /var/www/reliabilityservice && chown -f nobody:nobody /var/www/reliabilityservice
COPY --chown=nobody:nobody . /var/www/reliabilityservice

# Create link for custom configuration from Kubernetes ConfigMaps
RUN ln -sf /etc/config/config.json /var/www/reliabilityservice/config/config.json

WORKDIR /var/www/reliabilityservice/
EXPOSE 8080

CMD [ "/usr/local/bin/npm", \
      "--prefix", \
      "/var/www/reliabilityservice", \
      "start" ]
