.PHONY: setup dev backend frontend test lint typecheck check build

setup: ## Install backend + frontend dependencies
	./scripts/setup.sh

dev: ## Run backend and frontend together
	./scripts/dev.sh

backend: ## Run only the backend (:8000)
	./scripts/backend.sh

frontend: ## Run only the frontend (:5173)
	./scripts/frontend.sh

test: ## Run the backend test suite
	cd backend && uv run pytest tests -q

lint: ## Lint the backend with ruff
	cd backend && uv run ruff check .

typecheck: ## Type-check the backend with mypy
	cd backend && uv run mypy main.py ai.py schemas.py models.py database.py

check: lint typecheck test ## Lint + types + tests — the harness the agent runs each turn

build: ## Production build of the frontend
	cd frontend && npm run build
