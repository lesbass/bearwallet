ifneq (,$(wildcard ./.env.local))
    include .env.local
    export
endif

build:
	docker-compose build bearwallet

run:
	docker-compose up -d
	open http://localhost:3001

stop:
	docker-compose down

deploy:
	docker-compose up --build --force-recreate -d
