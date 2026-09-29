$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Module = Join-Path $Root "backend/java/labs-api"

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
Write-Host "Next: from $Module run .\gradlew.bat bootRun (Docker must stay Running)."
Write-Host "Check: GET http://localhost:8080/actuator/health"
