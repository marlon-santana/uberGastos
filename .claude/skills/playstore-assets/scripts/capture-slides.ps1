# Captura cada slide-*.html de uma pasta como PNG 1080x1920 via Chrome headless.
# Uso: .\capture-slides.ps1 -InDir <pasta com slide-*.html> -OutDir <pasta destino>
param(
  [Parameter(Mandatory=$true)][string]$InDir,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$Width = 1080,
  [int]$Height = 1920
)
$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome/Edge nao encontrado." }
New-Item -ItemType Directory -Force $OutDir | Out-Null

Get-ChildItem (Join-Path $InDir "slide-*.html") | ForEach-Object {
  # slide-1-home.html -> 1-home.png
  $base = $_.BaseName -replace '^slide-',''
  $png = Join-Path $OutDir "$base.png"
  $url = "file:///" + ($_.FullName -replace '\\','/')
  & $chrome --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --window-size=$Width,$Height --virtual-time-budget=1200 `
    --screenshot="$png" $url 2>$null | Out-Null
  if (Test-Path $png) { "OK  $base.png" } else { "FAIL $base" }
}
