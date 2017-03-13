FROM mhart/alpine-node:base-7.7.1
LABEL maintainer "Sohail Alam <sohail.alam.1990@gmail.com>"

# Set working directory
WORKDIR /tmp/app

# Copy application source
COPY src/ /tmp/app/src
COPY config/ /tmp/app/config
COPY public/ /tmp/app/public
COPY package.json yarn.lock gulpfile.js jsdoc.json run.sh /tmp/app/

# Install application dependencies
RUN apk add --no-cache curl && \
    touch ~/.profile && \
    curl -o install.sh https://yarnpkg.com/install.sh && \
    chmod +x install.sh && \
    /bin/sh install.sh && \
    source ~/.profile && \
    chmod +x run.sh && \
    yarn

# Expose the application port
EXPOSE 8080

# Run the app
CMD ["/bin/sh", "run.sh"]
