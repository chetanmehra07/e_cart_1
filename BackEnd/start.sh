#!/bin/bash
uvicorn operation_fastapi:app --host 0.0.0.0 --port $PORT

