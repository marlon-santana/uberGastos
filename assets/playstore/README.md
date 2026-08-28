# Assets da Play Store — DriverCash

Gerados via skill `playstore-assets`. Todas as imagens seguem a identidade visual
do app (tema dark `#0B1110`, verde `#1DB954`, fonte Manrope) e recriam telas
reais do DriverCash (Dashboard, Histórico, Custo Fixo, Novo Lançamento, Boas-vindas).

## Arquivos

| Arquivo | Dimensões | Uso na Play Console |
| --- | --- | --- |
| `icon-512x512.png` | 512×512 | Ícone do aplicativo |
| `feature-graphic-1024x500.png` | 1024×500 | Recurso gráfico (destaque) |
| `1-dashboard-1080x1920.png` | 1080×1920 | Captura de tela — telefone |
| `2-historico-1080x1920.png` | 1080×1920 | Captura de tela — telefone |
| `3-custofixo-1080x1920.png` | 1080×1920 | Captura de tela — telefone |
| `4-lancamento-1080x1920.png` | 1080×1920 | Captura de tela — telefone |
| `5-boasvindas-1080x1920.png` | 1080×1920 | Captura de tela — telefone |
| `tablet7/*-1080x1920.png` | 1080×1920 | Capturas de tela — tablet de 7" |
| `tablet10/*-2160x3840.png` | 2160×3840 | Capturas de tela — tablet de 10" |
| `video/comercial-30s-1080x1920.mp4` | 1080×1920, 24fps, 30s | Vídeo promocional (via YouTube, ver README da pasta) |

## Notas

- As capturas de tablet reaproveitam o layout de celular: o app não tem uma UI
  dedicada para tablet, então essas imagens só existem para satisfazer os
  requisitos técnicos de dimensão/proporção da Play Console. O 7" usa o PNG
  de celular direto (já compatível); o 10" é um upscale 2x do mesmo PNG.
- Se preferir não declarar suporte a tablet, é possível restringir o app a
  "somente celular" no catálogo de dispositivos da Play Console — isso remove
  a exigência de screenshots de tablet e as pastas `tablet7/`/`tablet10/`
  deixam de ser necessárias.
- Todo o texto usa a fonte Manrope embutida (mesma do app) — sem fallback de
  sistema, sem perda de acentuação em pt-BR.
- Fonte dos mockups: código atual em `src/features/dashboard`,
  `src/features/transactions`, `src/features/fixedCosts`, `src/features/welcome`
  e `src/shared/theme/colors.ts` — refletem a UI real na data de geração.
