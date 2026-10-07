$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Module = Join-Path $Root "backend/java/labs-api"
$Web = Join-Path $Root "frontend/react/labs-web"

function Fail([string]$Message) {
    Write-Error "FAIL: $Message"
    exit 1
}

Write-Host "== minhyuck-labs setup =="

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host "JDK not on PATH. Trying: winget install --id Microsoft.OpenJDK.25 -e"
        winget install --id Microsoft.OpenJDK.25 -e --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0) {
            Fail "Install JDK 25, open a new terminal so PATH updates, then re-run scripts/setup.ps1"
        }
    } else {
        Fail "JDK 25 required. Install a JDK 25 and put java on PATH, then re-run scripts/setup.ps1"
    }
}

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Fail "java still not on PATH. Open a new terminal, then re-run scripts/setup.ps1"
}

Write-Host "java: $((java -version 2>&1 | Select-Object -First 1))"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host "docker CLI not found. Trying: winget install --id Docker.DockerDesktop -e"
        winget install --id Docker.DockerDesktop -e --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0) {
            Fail "Install Docker Desktop, start it until Running, then re-run scripts/setup.ps1"
        }
        Fail "Docker Desktop install was requested. Start Docker Desktop, wait until it is Running, open a new terminal, then re-run scripts/setup.ps1"
    } else {
        Fail "docker CLI not found. Install Docker Desktop, start it, then re-run scripts/setup.ps1"
    }
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Fail "Docker CLI exists but the engine is not running. Start Docker Desktop, wait until it is Running, then re-run scripts/setup.ps1"
}
Write-Host "OK: Docker engine is running"

if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host "Node.js / npm not on PATH. Trying: winget install OpenJS.NodeJS.LTS -e"
        winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0) {
            Fail "Install Node.js LTS (npm included), open a new terminal, then re-run scripts/setup.ps1"
        }
        Fail "Node.js install was requested. Open a new terminal so PATH updates, then re-run scripts/setup.ps1"
    } else {
        Fail "Node.js and npm required for labs-web. Install Node.js LTS, then re-run scripts/setup.ps1"
    }
}

Write-Host "node: $((node -v 2>&1 | Select-Object -First 1))"
Write-Host "npm: $((npm -v 2>&1 | Select-Object -First 1))"

Write-Host "== ./gradlew test (H2, compose disabled) =="
Push-Location $Module
try {
    & .\gradlew.bat test
    if ($LASTEXITCODE -ne 0) {
        Fail "gradlew test failed"
    }
} finally {
    Pop-Location
}
Write-Host "OK: gradlew test finished"

Write-Host "== labs-web npm ci + npm run test =="
Push-Location $Web
try {
    npm ci
    if ($LASTEXITCODE -ne 0) { Fail "npm ci failed in labs-web" }
    npm run test
    if ($LASTEXITCODE -ne 0) { Fail "npm run test failed in labs-web" }
} finally {
    Pop-Location
}
Write-Host "OK: labs-web npm run test finished"

Write-Host "Next (API): cd $Module; .\gradlew.bat bootRun (Docker must stay Running)."
Write-Host "Next (web): cd $Web; npm run dev"
Write-Host "API health: GET http://localhost:8080/labs-api/actuator/health"
Write-Host "Full stack: bootRun + dev, then open http://localhost:3000 (Next rewrites /labs-api)."
