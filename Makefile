.PHONY: build lint test install

node_modules/.install: package-lock.json
	npm ci
	@touch node_modules/.install

install: node_modules/.install

build: node_modules/.install
	npm run build

lint: node_modules/.install
	npm run lint

test: node_modules/.install
	npm test

