param(
    [switch]$InstallDebug,
    [switch]$AssembleDebug
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$wrapperJar = Join-Path $projectRoot "gradle\wrapper\gradle-wrapper.jar"
$gradlew = Join-Path $projectRoot "gradlew.bat"

Write-Host "Student Utility Hub CLI runner"

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "Java is missing. Install JDK 17 first."
    exit 1
}

$javaVersion = & java -version 2>&1
Write-Host $javaVersion[0]

if ($javaVersion[0] -notmatch "17|21") {
    Write-Host "This project needs JDK 17 or JDK 21. Your current Java is too old."
}

if (-not (Test-Path $wrapperJar)) {
    Write-Host "gradle-wrapper.jar is not present yet."
    Write-Host "Install Gradle once, then run: gradle wrapper"
    Write-Host "After that, use .\gradlew.bat assembleDebug"
    exit 1
}

if ($AssembleDebug) {
    & $gradlew "assembleDebug"
    exit $LASTEXITCODE
}

if ($InstallDebug) {
    & $gradlew "installDebug"
    exit $LASTEXITCODE
}

Write-Host "Usage:"
Write-Host "  .\run.ps1 -AssembleDebug"
Write-Host "  .\run.ps1 -InstallDebug"
