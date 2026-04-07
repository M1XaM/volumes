# Build and Run
run:
	npm install --legacy-peer-deps
	npm run dev

build:
	npm install --legacy-peer-deps
	npm run build

clean:
	rm -rf node_modules dist
