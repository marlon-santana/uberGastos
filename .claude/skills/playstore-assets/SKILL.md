---
name: playstore-assets
description: Gera os recursos gráficos da ficha da Play Store — screenshots de marketing (1080×1920) das telas do app e, em seguida, um vídeo promocional vertical de 30s no mesmo estilo. Recria as telas em HTML/CSS com a identidade do app (Manrope + verde escuro estilo Spotify), renderiza via Chrome headless e monta o MP4 com ffmpeg. Use quando o usuário pedir "gerar screenshots pra Play Store", "criar imagens da loja", "fazer vídeo de propaganda", "comercial do app" ou invocar /playstore-assets.
argument-hint: "[screenshots|video|ambos] [duração-s] | vazio = ambos, 30s"
user-invocable: true
disable-model-invocation: false
model: claude-opus-4-8
---

# playstore-assets

Produz os recursos gráficos da ficha da Google Play Store para o app **DriverCash**, em dois entregáveis encadeados:

1. **Screenshots** — 5 imagens 1080×1920 (retrato 9:16), cada uma com um título de marketing em pt-BR + um mockup fiel de uma tela real do app, na identidade dark/verde do app.
2. **Vídeo promocional** — comercial vertical de ~30s (1080×1920, H.264+AAC) que anima as mesmas telas em cenas com crossfade, título cinético e CTA final, com trilha instrumental própria.

O vídeo **reaproveita** os componentes visuais dos screenshots (mesmo CSS, mesmas telas, mesma fonte embutida) — por isso os screenshots vêm primeiro e servem de base para o vídeo.

## Quando usar

- Usuário pediu screenshots/imagens para a ficha da Play Store.
- Usuário pediu um vídeo/comercial/propaganda do app para a loja.
- Usuário invocou `/playstore-assets`.
- O argumento controla o escopo: `screenshots` (só imagens), `video` (só o MP4, assumindo que os componentes já existem ou recriando-os), ou vazio/`ambos` (os dois, em ordem).

**Não usar para:** ícone do app / adaptive icon (isso é `src/shared/assets/icons/*` + prebuild, outro fluxo), nem para o feature graphic 1024×500 (formato diferente — se o usuário pedir, adaptar as dimensões, não os slides 9:16).

## Contexto do projeto (não redescobrir a cada execução)

- **Nome do app**: "DriverCash" (de `app.json` → `expo.name`; pacote Android `com.marlonnig.drivercash`).
- **Identidade visual** vem de [src/shared/theme/colors.ts](../../src/shared/theme/colors.ts) — tema **escuro** (`app.json` → `userInterfaceStyle: "dark"`): fundo quase preto `#0B1110`, superfícies `#131B19`/`#1A2522`/`#1F2B27`, verde primário `#1DB954` (estilo Spotify, com `primaryDark` `#149647`), âmbar secundário `#FFB020`, verde-claro de destaque `#4DD08A`, texto `#E9F4EE`, texto secundário `#89A299`, borda `#244038`, perigo `#FF5C5C`, info `#3DA9FC`.
- **Fonte**: **Manrope** (5 pesos: `Manrope_400Regular` … `Manrope_800ExtraBold`), carregada em [src/shared/hooks/useLoadFonts.ts](../../src/shared/hooks/useLoadFonts.ts) via `@expo-google-fonts/manrope`, mais ícones **Feather** (`@expo/vector-icons`). Tipografia sempre via `theme.font.regular`…`extrabold`; **nunca** `fontWeight` (confirmado — não há um único uso de `fontWeight` no código do app).
- **Telas de referência** (recriar a partir do código atual — ver passo 1):
  - Splash: [src/features/welcome/components/SplashScreen.tsx](../../src/features/welcome/components/SplashScreen.tsx)
  - Boas-vindas/onboarding: [src/features/welcome/index.tsx](../../src/features/welcome/index.tsx)
  - Dashboard: [src/features/dashboard/index.tsx](../../src/features/dashboard/index.tsx) + [SummaryCard](../../src/features/dashboard/components/SummaryCard.tsx) (cards de receita/despesa/lucro) + [PeriodToggle](../../src/features/dashboard/components/PeriodToggle.tsx) + [MoneyRain](../../src/features/dashboard/components/MoneyRain.tsx) (animação de "chuva de dinheiro" — ótimo gancho visual pro vídeo)
  - Histórico (transações): [src/features/transactions/index.tsx](../../src/features/transactions/index.tsx)
  - Custo Fixo: [src/features/fixedCosts/index.tsx](../../src/features/fixedCosts/index.tsx)
  - Configurações: [src/screens/SettingsScreen.tsx](../../src/screens/SettingsScreen.tsx)
  - Tab bar (4 abas — Dashboard, Histórico, Custo Fixo, Configurações, ícones Feather): [src/navigation/TabNavigator.tsx](../../src/navigation/TabNavigator.tsx)
- **Dimensões da Play Store**: screenshot de celular = **1080×1920** (9:16 retrato). Mínimo 2, máximo 8 imagens.
- **A Play Store NÃO aceita upload de vídeo** — usa um **link do YouTube** (campo "Vídeo promocional"). O entregável é o MP4; o usuário sobe no YouTube (pode ser "Não listado") e cola a URL no Play Console.
- **Saída versionada**: `assets/playstore/*.png` (imagens) e `assets/playstore/video/comercial-30s.mp4` (vídeo) — pasta ainda não existe neste projeto, criar na primeira execução. Cada pasta tem um `README.md` com specs e instruções de publicação.
- **Scripts reutilizáveis** ficam em `.claude/skills/playstore-assets/scripts/` (ver "Scripts disponíveis"). Eles são genéricos/parametrizados por caminho — o que muda a cada execução é o **HTML das telas**, que o Claude escreve do zero olhando o app atual.

## Ferramentas necessárias (checar antes de começar)

- **Node** (já existe — o projeto usa). Roda os geradores de HTML.
- **Google Chrome ou Edge** — renderiza os frames em headless (`--screenshot`). `render-frames.ps1`/`capture-slides.ps1` auto-detectam o caminho.
- **ffmpeg** — só para o vídeo (síntese de trilha + montagem do MP4). Se ausente, instalar com:
  ```
  winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
  ```
  `ffmpeg-path.ps1` auto-detecta o binário mesmo antes do PATH atualizar (winget não atualiza o PATH da sessão corrente). Se só forem gerados screenshots, ffmpeg não é necessário.

## Scripts disponíveis (`scripts/`)

| Script               | Papel                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `manrope-faces.js`   | Módulo Node: retorna o CSS `@font-face` com Manrope embutida em base64.                                |
| `split-slides.js`    | Divide o HTML "strip" dos screenshots em N páginas 1080×1920 standalone (com Manrope), uma por slide.  |
| `capture-slides.ps1` | Captura cada `slide-*.html` como PNG 1080×1920 via Chrome headless.                                    |
| `render-frames.ps1`  | Renderiza os frames do vídeo (relógio `?t=<seg>`) em PNG; suporta `-Single <t>` para 1 frame de teste. |
| `ffmpeg-path.ps1`    | Dot-source: define `$FFMPEG`/`$FFPROBE` auto-detectados.                                               |
| `make-music.ps1`     | Gera a trilha instrumental de N segundos via ffmpeg.                                                   |
| `assemble-video.ps1` | Monta o MP4 final (frames + trilha), com validação por ffprobe.                                        |

## Como executar

Todos os artefatos de trabalho (HTML, frames, trilha) vão para o **scratchpad da sessão**, não para o repo. Só os PNGs finais e o MP4 final entram em `assets/playstore/`.

### FASE 1 — Screenshots

**1.1 Reler o app e escrever o HTML "strip".** Antes de desenhar, reler [src/shared/theme/colors.ts](../../src/shared/theme/colors.ts) e as telas de referência (ver Contexto) para pegar cores, textos e layout **atuais** — a UI pode ter mudado desde a última execução. Depois escrever um único `playstore.html` no scratchpad com:

- Um bloco `<style>` com os componentes das telas (cards de resumo, tab bar, toggle de período, lista de histórico, tela de custo fixo, chuva de dinheiro) — recriação fiel em CSS puro dos componentes RN. Reutilizar as convenções do app: fundo escuro, raios generosos, sombras suaves (ver `shadow.card`/`soft`/`primary`), cores por hex do theme.
- Um `<div class="strip">` com **5 `.slide-wrap`**, cada um precedido de `<!-- ==== SLIDE N ==== -->`, no formato `<div class="slide-wrap"><div class="slide" style="background:...">...</div></div>`.
- Cada slide = fundo temático + bloco de headline (kicker + `.head` + `.sub`) + um `.phone` (moldura) contendo `.screen` com a tela recriada.
- Os 5 slides sugeridos (ajustar títulos/telas conforme o app): **Dashboard** ("Veja seu lucro real, na hora"), **Histórico** ("Cada corrida, registrada"), **Custo Fixo** ("Combustível, seguro, manutenção sob controle"), **Boas-vindas** ("Comece em segundos"), **Fecho/valor** (logo + 3 benefícios + "Baixe grátis agora").
- O `.slide` renderiza em 1080×1920; para o preview em navegador pode ter `transform:scale(...)`, mas o `split-slides.js` reseta isso para 1:1 na exportação.

**1.2 Publicar um Artifact** do `playstore.html` (para o usuário ver/aprovar o preview antes da exportação). Favicon 💰.

**1.3 Dividir e capturar:**

```
node .claude/skills/playstore-assets/scripts/split-slides.js <scratch>/playstore.html <scratch> 1-dashboard,2-historico,3-custofixo,4-boasvindas,5-valor
```

```
.claude/skills/playstore-assets/scripts/capture-slides.ps1 -InDir <scratch> -OutDir C:\uberGastos\assets\playstore
```

**1.4 Verificar visualmente** cada PNG (abrir com Read). Conferir: dimensões exatas 1080×1920, **acentos pt-BR corretos** (Manrope), nada cortado (conteúdo cabendo na moldura), tab bar opaca sem "sangramento" de conteúdo por trás. Se algo cortar, ajustar altura do `.screen` daquele slide no HTML e re-exportar só ele.

### FASE 2 — Vídeo

**2.1 Garantir ffmpeg** (ver "Ferramentas necessárias"); instalar se faltar.

**2.2 Escrever o `video.html`** no scratchpad — uma página **determinística** dirigida por `?t=<segundos>`:

- Reutiliza o mesmo `<style>` de componentes dos screenshots + Manrope embutida (via `manrope-faces.js`).
- Um `<script>` lê `?t=`, calcula opacidade de cada cena e as animações internas (sem `requestAnimationFrame`, `Date.now()` nem `Math.random()` — tudo função pura de `t`, senão a captura não é reproduzível).
- **Cenas (30s):** 0–3s gancho → 3–10s Dashboard (contador de lucro anima, chuva de dinheiro cai) → 10–16s Histórico (lista de corridas entra) → 16–22s Custo Fixo (barras/lista de despesas crescem) → 22–30s logo + benefícios + CTA.
- **Crossfade correto (CRÍTICO):** cada cena faz fade centrado na fronteira — a cena que entra sobe de 0→1 enquanto a que sai cai de 1→0 sobre a MESMA janela (largura `XF≈0.6s`, centrada no instante da troca), usando smoothstep. A cena que entra é a mais recente no DOM (pintada por cima). A primeira cena começa opaca; a última termina opaca. **Nunca** agende fade-out e fade-in em janelas separadas e adjacentes — isso deixa as duas invisíveis no instante exato da troca e gera **flash preto** (bug já ocorrido nesta skill em outro projeto).

**2.3 Testar frames de fronteira ANTES de renderizar tudo.** Renderizar só os instantes das trocas + início + fim:

```
.claude/skills/playstore-assets/scripts/render-frames.ps1 -Html <scratch>/video.html -OutDir <scratch>/boundary -Single 3.0
```

(repetir para t = 0, 3, 10, 16, 22, 29.9). Abrir cada PNG com Read e confirmar **nenhum frame preto** e acentos corretos. Só prosseguir se as fronteiras estiverem limpas.

**2.4 Gerar a trilha:**

```
.claude/skills/playstore-assets/scripts/make-music.ps1 -Out <scratch>/music.m4a -Dur 30
```

**2.5 Renderizar todos os frames** (24fps × 30s = 720 frames, ~15 min). Rodar em **background** e aguardar a notificação de conclusão — não fazer polling em loop:

```
.claude/skills/playstore-assets/scripts/render-frames.ps1 -Html <scratch>/video.html -OutDir <scratch>/frames -Fps 24 -Dur 30
```

**2.6 Montar o MP4:**

```
.claude/skills/playstore-assets/scripts/assemble-video.ps1 -Frames <scratch>/frames -Music <scratch>/music.m4a -Out C:\uberGastos\assets\playstore\video\comercial-30s.mp4 -Fps 24
```

**2.7 Validar o MP4:** `assemble-video.ps1` já roda ffprobe. Confirmar duração ≈ dur pedida, 1080×1920, 24fps, faixa `aac`. Extrair 1–2 frames do MP4 final (via ffmpeg `-ss`) e abrir com Read para confirmar integridade + acentos.

**2.8 Escrever/atualizar os READMEs** em `assets/playstore/` e `assets/playstore/video/` (specs, roteiro, instruções de publicação via YouTube).

## Loop de validação (até 3 ciclos por fase)

### Interpretar sintomas

| Sintoma                                                              | Causa provável                                                                                          | Correção                                                                                                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frame do vídeo totalmente **preto** num instante de troca            | Fade-out e fade-in em janelas adjacentes (não sobrepostas) → ambas as cenas em opacidade 0 na fronteira | Reescrever o crossfade centrado na fronteira (ver 2.2); re-testar frames de fronteira antes de re-renderizar tudo                                                                     |
| **Acentos sumindo** ("combustível", "histórico", "média")            | Chrome caiu no fallback de sistema (Manrope não embutida) OU string do gerador perdeu os acentos        | Garantir `manrope-faces.js` no `<head>` e `<meta charset="utf-8">`; escrever o arquivo em UTF-8 e restaurar acentos (pode manter fonte ASCII e trocar por entidades/replace no final) |
| Conteúdo da tela **cortado** dentro da moldura                       | `.screen` mais baixo que o conteúdo (o app rola, o screenshot não)                                      | Aumentar a altura do `.screen` daquele slide e/ou reposicionar o `.phone`; reduzir wrapping alargando a moldura (`.phone` mais largo)                                                 |
| Tela do celular **em branco** no export                              | O split pegou só parte do slide (regex não-guloso parou cedo)                                           | Usar `split-slides.js` (divide por comentário-banner de slide, não por `</div>`); conferir que cada slide tem seu marcador `<!-- ==== SLIDE ... -->`                                  |
| Frames salvos como `f5,5.png` / `?t=5,5` / ffmpeg não acha os frames | Locale pt-BR formatou decimal com vírgula                                                               | Sempre `CultureInfo::InvariantCulture` (ponto) — já embutido nos scripts; se escrever comando manual, replicar                                                                        |
| `node` erro `ENOENT ...\/c\/...ttf`                                  | Caminho estilo MSYS (`/c/...`) passado ao Node no Windows                                               | Usar caminho Windows (`C:/...`) em qualquer path que vá para o Node                                                                                                                   |
| `ffmpeg NAO encontrado`                                              | ffmpeg não instalado, ou PATH da sessão desatualizado após winget                                       | Instalar via winget; `ffmpeg-path.ps1` acha o binário na pasta de pacotes do winget sem depender do PATH                                                                              |
| Título do vídeo dá `SyntaxError: Unexpected identifier` ao gerar     | Backtick dentro de comentário/string num template literal do gerador Node                               | Não usar backticks no conteúdo do `<script>` gerado; escapar `</script>` como `'</scr'+'ipt>'`                                                                                        |
| MP4 gera mas parece "acelerado"/"lento"                              | `-framerate` (entrada) e `-r` (saída) divergentes do FPS dos frames                                     | Manter `-Fps` consistente entre `render-frames.ps1` e `assemble-video.ps1`                                                                                                            |

### Aplicar correções

Corrigir **somente** a causa raiz identificada. Sempre re-testar os frames de fronteira (vídeo) ou re-exportar o slide afetado (screenshots) antes de refazer o render completo — o render de 720 frames leva ~15 min, então validar barato antes de pagar caro.

### Limite de tentativas

Após **3 ciclos** sem sucesso numa fase, reportar o sintoma exato, a causa provável (tabela acima) e o próximo passo. **Não** aumentar `--virtual-time-budget` às cegas nem re-renderizar tudo repetidamente na esperança de "dar certo" — diagnosticar no frame de teste primeiro.

## Formato da resposta final

1. **Fase 1 (screenshots):** lista dos 5 PNGs salvos (com link markdown), confirmação de dimensões 1080×1920 e de que os acentos/telas estão corretos. Link do Artifact de preview.
2. **Fase 2 (vídeo):** caminho do MP4, specs validadas por ffprobe (duração, resolução, fps, áudio), tamanho, e o roteiro das cenas em tabela.
3. **Ressalva de verificação:** não é possível dar play no MP4 aqui — recomendar ao usuário abrir uma vez para ouvir a trilha e ver o movimento.
4. **Publicação:** lembrar que a Play Store usa link do YouTube para o vídeo (upload de arquivo só para os PNGs).
5. Se algo falhou após 3 ciclos: sintoma, causa, próximo passo manual.

## Anti-patterns a evitar

- Renderizar os 720 frames do vídeo **antes** de validar os frames de fronteira — desperdiça ~15 min por bug de crossfade não detectado.
- Fade-out e fade-in em janelas adjacentes (flash preto). Sempre crossfade sobreposto e centrado na troca.
- Esquecer de embutir Manrope → tipografia errada e acentos perdidos no headless.
- Usar `Date.now()`/`Math.random()`/`requestAnimationFrame` no `video.html` — quebra a captura determinística por `?t=`.
- Formatar decimais com locale do sistema (vírgula) em nomes de frame / `?t=` / args de ffmpeg — sempre invariante.
- Passar caminho MSYS (`/c/...`) para o Node no Windows — usar `C:/...`.
- Commitar o scratchpad (HTML, frames, trilha) — só os PNGs finais e o MP4 vão para `assets/playstore/`.
- Prometer que o vídeo sobe direto na Play Store — ele vai via YouTube.
- Assumir que as telas não mudaram — reler o app atual antes de recriar os mockups.
- Fazer polling em loop no render de background — aguardar a notificação de conclusão.

## Exemplo de invocação

```
/playstore-assets
```

ou, escopo/parâmetros específicos:

```
/playstore-assets video 15

Quero só um comercial mais curto, de 15 segundos, com os mesmos textos.
```
