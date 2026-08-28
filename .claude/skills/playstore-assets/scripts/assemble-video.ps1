# Monta o MP4 final a partir da sequencia de frames PNG + trilha de audio.
# H.264 High + yuv420p (compatibilidade maxima YouTube/Play), +faststart.
#
# Uso:
#   .\assemble-video.ps1 -Frames <pasta f%05d.png> -Music <arquivo> -Out <mp4> -Fps 24
#   .\assemble-video.ps1 -Frames <pasta> -Out <mp4> -Fps 24          # sem audio (mudo)
param(
  [Parameter(Mandatory=$true)][string]$Frames,
  [Parameter(Mandatory=$true)][string]$Out,
  [string]$Music = "",
  [int]$Fps = 24
)
. (Join-Path $PSScriptRoot "ffmpeg-path.ps1")
if (-not $FFMPEG) { throw "ffmpeg necessario para montar o video." }

New-Item -ItemType Directory -Force (Split-Path $Out) | Out-Null
$pattern = Join-Path $Frames "f%05d.png"

if ($Music -and (Test-Path $Music)) {
  & $FFMPEG -y `
    -framerate $Fps -i $pattern `
    -i $Music `
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium `
    -r $Fps -movflags +faststart `
    -c:a aac -b:a 160k -shortest `
    $Out 2>&1 | Select-Object -Last 3
} else {
  & $FFMPEG -y `
    -framerate $Fps -i $pattern `
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium `
    -r $Fps -movflags +faststart `
    $Out 2>&1 | Select-Object -Last 3
}

if (Test-Path $Out) {
  $sz = [math]::Round((Get-Item $Out).Length/1MB, 2)
  "OK video -> $Out ($sz MB)"
  if ($FFPROBE) {
    & $FFPROBE -v error -show_entries "format=duration:stream=codec_type,codec_name,width,height,r_frame_rate" -of default=noprint_wrappers=1 $Out
  }
} else { "FAIL: video nao gerado" }
