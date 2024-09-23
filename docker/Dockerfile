FROM node:20
WORKDIR /app

# Install dependencies
COPY package*.json /app/
RUN mkdir -p /var/logging/supervisor \
    && npm install \
    && apt-get update \
    && apt-get install -y supervisor \
    && apt-get install -y openssh-server \
    && echo "root:Docker!" | chpasswd \
    && mkdir -p /run/sshd

# Copy source code and configuration files
COPY ./build /app/build
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/sshd_config /etc/ssh/
COPY ./docker/startup.sh /app/

EXPOSE 2223 2224 9002 80 8080 443 22
CMD ["sh", "/app/startup.sh"]
