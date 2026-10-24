.PHONY: install build lint fix test mutation check

node_modules/.install: package-lock.json
	npm ci
	@touch node_modules/.install

install: node_modules/.install

build: node_modules/.install
	npm run build

lint: node_modules/.install
	npm run lint

fix: node_modules/.install
	npx typescript fix

# invariant: the specs load the extension VS Code loads, dist/index.cjs.
test: build
	npx typescript test

mutation: build
	npx typescript mutation

check: lint test mutation
