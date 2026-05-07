.PHONY: all run stop down

all: run

run:
	docker compose up --build

stop:
	docker compose down -v

down:
	docker compose down -v
