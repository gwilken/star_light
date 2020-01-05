FROM node:12-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /home/appuser

RUN apk --no-cache add --virtual builds-deps build-base python

COPY --chown=appuser:appgroup . .

RUN npm i

#RUN rm -rf ./app

EXPOSE 4000

USER appuser

ENTRYPOINT [ "sh", "./entrypoint.sh" ]
