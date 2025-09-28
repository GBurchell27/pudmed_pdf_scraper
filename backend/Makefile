PYTHON ?= python
APP_MODULE = app.main:app
UVICORN = uvicorn

.PHONY: install run dev test lint

install:
	$(PYTHON) -m pip install -r requirements.txt

run:
	$(UVICORN) $(APP_MODULE) --host 0.0.0.0 --port 8000

dev:
	$(UVICORN) $(APP_MODULE) --reload

test:
	$(PYTHON) -m pytest
