#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODULE="${ROOT}/backend/java/labs-api"
WEB="${ROOT}/frontend/react/labs-web"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

ok() {
  echo "OK: $*"
}

echo "== minhyuck-labs setup =="

if ! command -v java >/dev/null 2>&1; then
  if [[ "$(uname -s)" == "Darwin" ]] && command -v brew >/dev/null 2>&1; then
    echo "JDK not on PATH. Trying: brew install openjdk@25"
    brew install openjdk@25 || fail "Install JDK 25, put java on PATH, then re-run scripts/setup.sh"
  else
    fail "JDK 25 required. Install a JDK 25 and put java on PATH, then re-run scripts/setup.sh"
  fi
fi

if ! command -v java >/dev/null 2>&1; then
  fail "java still not on PATH after install. Add the JDK bin directory to PATH, then re-run scripts/setup.sh"
fi

echo "java: $(java -version 2>&1 | head -n 1)"
if ! java -version 2>&1 | grep -Eq '"25([."]|$)'; then
  echo "WARN: java does not look like major 25. labs-api toolchain is 25."
fi

if ! command -v docker >/dev/null 2>&1; then
  if [[ "$(uname -s)" == "Darwin" ]] && command -v brew >/dev/null 2>&1; then
    echo "docker CLI not found. Trying: brew install --cask docker"
    brew install --cask docker || fail "Install Docker Desktop, start it until Running, then re-run scripts/setup.sh"
  else
    fail "docker CLI not found. Install Docker Desktop (or an equivalent engine), start it, then re-run scripts/setup.sh"
  fi
fi

if ! docker info >/dev/null 2>&1; then
  fail "Docker CLI exists but the engine is not running. Start Docker Desktop, wait until it is Running, then re-run scripts/setup.sh"
fi
ok "Docker engine is running"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  if [[ "$(uname -s)" == "Darwin" ]] && command -v brew >/dev/null 2>&1; then
    echo "Node.js / npm not on PATH. Trying: brew install node"
    brew install node || fail "Install Node.js (npm included), then re-run scripts/setup.sh"
  else
    fail "Node.js and npm required for labs-web. Install from nodejs.org or your package manager, then re-run scripts/setup.sh"
  fi
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  fail "node or npm still not on PATH after install. Open a new terminal, then re-run scripts/setup.sh"
fi

echo "node: $(node -v 2>&1)"
echo "npm: $(npm -v 2>&1)"

echo "== ./gradlew test (H2, compose disabled) =="
(cd "${MODULE}" && ./gradlew test)
ok "gradlew test finished"

echo "== labs-web npm ci + npm run test =="
(cd "${WEB}" && npm ci && npm run test)
ok "labs-web npm run test finished"

echo "Next (API): cd ${MODULE} && ./gradlew bootRun (Docker must stay Running)."
echo "Next (web): cd ${WEB} && npm run dev"
echo "API health: GET http://localhost:8080/labs-api/actuator/health"
echo "Full stack: bootRun + dev, then open http://localhost:3000 (Next rewrites /labs-api)."
