
# The instructions for the first stage
FROM node:10-alpine as builder

COPY . /gcc-medical-tracker

WORKDIR /gcc-medical-tracker
RUN apk --no-cache add --virtual builds-deps build-base python
RUN rm -rf node_modules && \
    npm install

# The instructions for second stage
FROM node:10-alpine

#WORKDIR /usr/src/app
COPY --from=builder /gcc-medical-tracker /gcc-medical-tracker

RUN apk --no-cache add --virtual builds-deps build-base curl python && \
     adduser -u 502 -h /gcc-medical-tracker -D -H api && \
     chown -R api /gcc-medical-tracker

RUN rm -rf node_modules && \
    rm -rf src && \
    npm install --production

WORKDIR /gcc-medical-tracker
USER api
EXPOSE 3000
CMD npm start
