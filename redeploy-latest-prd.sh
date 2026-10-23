#!/usr/bin/env bash
# Pull main and redeploy the production Docker stack.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

IMAGE_TAG="edu-organizer-backend-prd"
COMPOSE_PROJECT="eduorg-prd"
COMPOSE_FILE="docker-compose.prd.yml"

echo "==> Checking working tree..."
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  echo "Error: working tree is not clean. Commit, stash, or discard changes before redeploying."
  exit 1
fi

echo "==> Switching to main..."
git checkout main

echo "==> Pulling latest..."
git pull --ff-only origin main

echo "==> Building image: ${IMAGE_TAG}"
docker build -t "${IMAGE_TAG}" .

echo "==> Stopping PRD stack (${COMPOSE_PROJECT})..."
docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" down

echo "==> Starting PRD stack (${COMPOSE_PROJECT})..."
docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" up -d

echo "==> Done. PRD is running the latest main."
docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" ps
