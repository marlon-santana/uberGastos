# Vídeo promocional — DriverCash

`comercial-30s-1080x1920.mp4` — 1080×1920, H.264 (yuv420p) + AAC, 24fps, 30s, ~1.7MB.

## Roteiro (5 cenas, crossfade de ~0,6s entre cada)

| Tempo | Cena | Conteúdo |
| --- | --- | --- |
| 0–3s | Gancho | Logo DriverCash + tagline "Controle financeiro de verdade, pra quem vive de corrida" |
| 3–10s | Dashboard | Cards de Ganhos/Despesas, contador de Lucro animando até R$ 887,50, chuva de dinheiro |
| 10–16s | Histórico | Lista de lançamentos (corridas, combustível, manutenção) entrando em cascata |
| 16–22s | Custo Fixo | "Total diário necessário" contando até R$ 68,40/dia, barra de progresso do aluguel do carro |
| 22–30s | Fecho / CTA | Logo + 3 benefícios + botão "Baixe grátis agora" com pulso |

## Publicação na Play Console

A Play Console **não aceita upload de arquivo de vídeo** — o campo "Vídeo
promocional" pede um link do YouTube. Passos:

1. Suba `comercial-30s-1080x1920.mp4` no YouTube (pode ser **"Não listado"**,
   não precisa ser público).
2. O vídeo do YouTube precisa: ser público ou não listado, **não** ter
   restrição de idade, e os anúncios pré-roll precisam estar desativados
   nesse vídeo específico (configuração do YouTube Studio).
3. Cole a URL do YouTube no campo "Vídeo" da ficha da loja.

## Verificação recomendada

Este ambiente não reproduz vídeo — recomendo abrir o MP4 uma vez localmente
para confirmar visualmente o movimento das cenas e ouvir a trilha antes de
subir no YouTube. Frames extraídos em t=5.5s e t=18s foram verificados
(integridade, acentuação e ausência de flash preto nas transições).

## Regenerar

O HTML fonte (`video.html`) e os scripts genéricos ficam em
`.claude/skills/playstore-assets/scripts/`. Para gerar um vídeo diferente
(duração, roteiro, textos), invoque a skill novamente: `/playstore-assets video`.
