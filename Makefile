DB_PG_PORT=5000
DB_USER=root
DB_PWD=pwd
DB_NAME=ms-auth

db-start:
	docker run -d -p $(DB_PG_PORT):5432 -e POSTGRES_USER=$(DB_USER) -e POSTGRES_PASSWORD=$(DB_PWD) -e POSTGRES_DB=${DB_NAME} -v `pwd`/data:/var/lib/postgresql/data --rm --name $(DB_NAME) postgres:latest
db-stop:
	docker kill $(DB_NAME)