# Gera uma trilha instrumental calma de N segundos (sem direitos de terceiros)
# via sintese de sines no ffmpeg. Bed quente C/G com leve tremolo e fades.
#
# Uso: .\make-music.ps1 -Out <arquivo.m4a> -Dur 30
param(
  [Parameter(Mandatory=$true)][string]$Out,
  [double]$Dur = 30.0
)
. (Join-Path $PSScriptRoot "ffmpeg-path.ps1")
if (-not $FFMPEG) { throw "ffmpeg necessario para gerar a trilha." }

$ci = [System.Globalization.CultureInfo]::InvariantCulture
$d = $Dur.ToString("0.####", $ci)
$fadeOutSt = ($Dur - 2.5).ToString("0.####", $ci)

$filter = "[0]volume=0.22[bass];[1]volume=0.12[b];[2]volume=0.12[c];[3]volume=0.10[d];" +
          "[bass][b][c][d]amix=inputs=4:normalize=0[mix];" +
          "[mix]tremolo=f=0.18:d=0.35,highpass=f=90,lowpass=f=2600," +
          "afade=t=in:st=0:d=1.8,afade=t=out:st=$fadeOutSt`:d=2.5,volume=0.55[out]"

& $FFMPEG -y `
  -f lavfi -i "sine=frequency=130.81:duration=$d" `
  -f lavfi -i "sine=frequency=196.00:duration=$d" `
  -f lavfi -i "sine=frequency=261.63:duration=$d" `
  -f lavfi -i "sine=frequency=329.63:duration=$d" `
  -filter_complex $filter `
  -map "[out]" -ar 44100 -ac 2 $Out 2>$null | Out-Null

if (Test-Path $Out) { "OK trilha -> $Out ($([math]::Round((Get-Item $Out).Length/1KB)) KB, $Dur s)" }
else { "FAIL: trilha nao gerada" }
