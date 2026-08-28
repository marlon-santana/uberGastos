# Dot-source este arquivo para obter $FFMPEG e $FFPROBE.
# Auto-detecta o ffmpeg: PATH -> alias do winget -> pasta de pacotes do winget -> chocolatey.
# (winget nao atualiza o PATH da sessao atual, dai a busca no diretorio de pacotes.)
function Find-FfmpegExe([string]$exe) {
  $cmd = Get-Command $exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $link = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Links\$exe.exe"
  if (Test-Path $link) { return $link }
  $pkgRoot = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages"
  if (Test-Path $pkgRoot) {
    $hit = Get-ChildItem $pkgRoot -Recurse -Filter "$exe.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($hit) { return $hit.FullName }
  }
  $choco = "C:\ProgramData\chocolatey\bin\$exe.exe"
  if (Test-Path $choco) { return $choco }
  return $null
}
$FFMPEG  = Find-FfmpegExe "ffmpeg"
$FFPROBE = Find-FfmpegExe "ffprobe"
if (-not $FFMPEG) {
  Write-Host "ffmpeg NAO encontrado. Instale com:  winget install --id Gyan.FFmpeg -e"
}
