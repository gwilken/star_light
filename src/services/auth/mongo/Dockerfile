FROM mongo:4.2

COPY starlight /starlight

CMD mongorestore --host=auth_mongo:27017 -d starlight starlight
