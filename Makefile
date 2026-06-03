.PHONY: setup dev backend frontend test build

setup: ## Install backend + frontend dependencies
	./scripts/setup.sh

dev: ## Run backend and frontend together
	./scripts/dev.sh

backend: ## Run only the backend (:8000)
	./scripts/backend.sh

frontend: ## Run only the frontend (:5173)
	./scripts/frontend.sh

test: ## Run the backend test suite
	cd backend && uv run pytest tests/test_api.py -v

build: ## Production build of the frontend
	cd frontend && npm run build
