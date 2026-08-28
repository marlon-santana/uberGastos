# Renderiza frames de uma pagina HTML deterministica (relogio via ?t=<segundos>)
# usando Chrome headless. Cada frame vira um PNG 1080x1920 (ou o tamanho passado).
#
# A pagina HTML DEVE ler o parametro ?t= e desenhar o estado exato daquele instante
# (sem requestAnimationFrame / Date.now()), para que a captura seja reproduzivel.
#
# Uso:
#   .\render-frames.ps1 -Html <caminho> -OutDir <pasta> -Fps 24 -Dur 30
#   .\render-frames.ps1 -Html <caminho> -OutDir <pasta> -Single 5.5   # 1 frame de teste
#
# Lições embutidas:
#  - Nomes de frame com padding fixo (f00001.png) e tempo formatado em cultura
#    INVARIANTE (ponto decimal) — o locale pt-BR gera "5,5" e quebra o ?t= e o ffmpeg.
#  - --force-device-scale-factor=1 garante 1080x1920 reais (sem DPI do sistema).
#  - --virtual-time-budget da tempo das fontes/base64 assentarem antes do print.
param(
  [Parameter(Mandatory=$true)][string]$Html,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$Fps = 24,
  [double]$Dur = 30.0,
  [int]$Width = 1080,
  [int]$Height = 1920,
  [int]$Start = 0,
  [int]$End = -1,
  [double]$Single = -1
)

$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome/Edge nao encontrado. Instale o Google Chrome." }

New-Item -ItemType Directory -Force $OutDir | Out-Null
$ci = [System.Globalization.CultureInfo]::InvariantCulture
$htmlUrl = "file:///" + ($Html -replace '\\','/')

function Capture([double]$t, [string]$png) {
  $tstr = $t.ToString("0.####", $ci)
  $url = $htmlUrl + "?t=" + $tstr
  & $chrome --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --window-size=$Width,$Height --virtual-time-budget=1200 `
    --screenshot="$png" $url 2>$null | Out-Null
}

if ($Single -ge 0) {
  $png = Join-Path $OutDir ("single_" + $Single.ToString("0.####", $ci) + ".png")
  Capture $Single $png
  if (Test-Path $png) { "OK single t=$Single -> $png" } else { "FAIL single t=$Single" }
  return
}

$total = [int]([math]::Round($Dur * $Fps))
if ($End -lt 0) { $End = $total - 1 }
for ($f = $Start; $f -le $End; $f++) {
  $t = ($f / $Fps)
  $name = "f{0:D5}.png" -f $f
  Capture $t (Join-Path $OutDir $name)
}
"rendered frames $Start..$End of $total ($Fps fps, $Dur s)"
