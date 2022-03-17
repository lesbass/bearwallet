build:
	docker-compose --env-file=.env.local build bearwallet

run:
	docker-compose --env-file=.env.local up -d
	open http://localhost:3001

stop:
	docker-compose --env-file=.env.local down

deploy:
	docker-compose --env-file=.env.local up --build --force-recreate -d
