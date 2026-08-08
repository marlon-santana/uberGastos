---
name: aso-play-store
description: Especialista em ASO para Google Play — escreve/otimiza nome, descrição curta e descrição completa de qualquer app, com palavras-chave naturais, dentro dos limites da Play Console e sem keyword stuffing. Use quando o usuário pedir "ASO", "otimizar a ficha da Play Store", "descrição do app pra loja", "SEO do app no Google Play", "título e descrição pro Google Play" ou invocar /aso-play-store. Serve para qualquer app, não só o do projeto atual.
argument-hint: "[nome do app / contexto] | vazio = detecta o app do projeto atual e pergunta o que faltar"
user-invocable: true
---

# aso-play-store

ASO (App Store Optimization) para a **Google Play Store**: nome, descrição
curta e descrição completa otimizados para busca, sempre priorizando quem lê —
nunca _keyword stuffing_.

## Quando usar

- Criar ou otimizar a ficha de um app na Google Play.
- Pedidos de "ASO", "SEO pra Play Store", "melhorar posicionamento nas buscas".
- Invocação de `/aso-play-store`.

Serve para **qualquer app do usuário**. Se não estiver claro de qual app se
trata, pergunte (Passo 1).

**Não usar para a Apple App Store:** lá as keywords vão num campo dedicado de
100 caracteres e a descrição **não** é indexada — as regras abaixo não valem.
Avise a diferença antes de prosseguir.

## Campos, limites e peso na busca

O Google não pesa todos os campos igual. Ponha a palavra-chave principal no de
maior peso e distribua as demais a partir dali:

| Campo (Play Console) | Limite | Peso na busca |
| -------------------- | ------ | ------------- |
| Nome do app          | 30     | mais alto     |
| Descrição curta      | 80     | alto          |
| Descrição completa   | 4000   | médio         |

Dois detalhes que mudam o resultado:

- **Estourar o limite = campo cortado ou rejeitado** no Console. Conferir é
  obrigatório, não opcional (Passo 6).
- Na ficha, a **descrição curta** fica visível de cara; a completa só aparece
  depois de um toque em "Saiba mais". Então a curta carrega quase todo o peso
  de convencer, e as primeiras linhas da completa são as únicas garantidas de
  serem lidas por quem expande — front-load o gancho e a keyword principal.

## Passo 1 — Descobrir o aplicativo

Reúna, antes de escrever qualquer texto:

nome · categoria · público-alvo · problema que resolve · diferenciais ·
principais funcionalidades

Nesta ordem de esforço:

1. O que o usuário já descreveu na mensagem.
2. Se houver projeto no diretório, leia `app.json`/`app.config.js`,
   `package.json`, `pubspec.yaml`, `README`, `CLAUDE.md` — extraia nome e
   funcionalidades **reais**.
3. O que ainda faltar (público-alvo, diferencial, problema que resolve) →
   **pergunte**. Não preencha com suposição genérica: texto vago converte pior
   e some no meio da categoria.

**Regra dura:** toda funcionalidade citada no texto final tem que vir do que o
usuário disse ou do que o código/README mostra. Não invente recurso — além de
ser promessa falsa (proibido pelas políticas), gera review ruim e risco de
remoção.

## Passo 2 — Palavras-chave

Levante termos que o usuário real digitaria, priorizando volume, relevância e
intenção de busca. Misture os três tamanhos:

| Tipo      | Exemplo                      |
| --------- | ---------------------------- |
| curta     | editor de fotos              |
| média     | editor de fotos profissional |
| long-tail | remover fundo de foto com IA |

Como validar em vez de adivinhar:

- Use `WebSearch` para ver como o público realmente nomeia o problema e que
  termos circulam na categoria — para **pesquisar demanda**, nunca para copiar
  texto de concorrente.
- Inclua a forma conversacional/por voz ("app pra editar foto com IA", "como
  remover fundo de imagem"): casa com long-tail e com busca falada.
- Prefira sinônimos e variações a repetir o mesmo termo — é o que evita
  stuffing e amplia a cobertura ao mesmo tempo.

## Passo 3 — Nome do app (e variações de título)

- Claro, natural, legível, com a palavra-chave principal. Máx. **30**.
- Sem emoji, sem símbolo decorativo, sem empilhar keywords.
- Padrão que funciona: `Marca: keyword principal`
  (ex.: `FotoIA: editor de fotos`).
- No Google Play, "nome" e "título" são o **mesmo campo**. Para os dois itens
  da saída não ficarem redundantes: entregue em **Nome otimizado** o valor
  exato recomendado, e em **Título** 2–3 variações alternativas do mesmo campo
  para o usuário testar.

## Passo 4 — Descrição curta

Máx. **80**. Um benefício concreto + palavra-chave principal + convite à ação.
É o texto mais lido da ficha depois do nome — não gaste com "o melhor app do
mundo".

## Passo 5 — Descrição completa

Máx. **4000**, nesta estrutura:

1. **Introdução** — gancho + palavra-chave principal nas primeiras linhas.
2. **Benefício principal**
3. **Funcionalidades** (lista)
4. **Problemas que resolve**
5. **Diferenciais**
6. **Chamada para ação**

Títulos curtos, listas, parágrafos de 2–3 linhas. Legibilidade pesa tanto
quanto keyword: ficha densa derruba conversão.

Distribua as keywords em frases reais:

- ❌ `editor de foto, editor de foto, editor de foto`
- ✅ `Edite fotos rapidamente com ferramentas de IA para remover fundo,
  melhorar imagens e aplicar filtros.`

## Passo 6 — Conferir os limites (não pule)

Contar caractere no olho é exatamente onde esse tipo de entrega falha — um
título de 34 caracteres passa despercebido e volta como retrabalho. Meça de
fato antes de entregar:

```bash
printf '%s' "Nome do app aqui" | wc -m
```

Para a descrição completa, salve num arquivo e rode `wc -m arquivo.txt`
(descontando a quebra de linha final). Acento conta 1 caractere.

Publique a contagem junto de cada campo na saída (`Nome (28/30)`) — assim o
usuário cola direto no Console sem conferir de novo.

## Nunca

- Spam, _keyword stuffing_, palavra repetida sem contexto.
- Copiar texto de concorrente.
- Prometer recurso que o app não tem.
- Excesso de CAIXA ALTA; emoji no nome (zero) e em excesso na descrição.

## Linguagem

Português brasileiro; tom profissional, claro, persuasivo, natural. Se o app
for para outro mercado, adapte o idioma mantendo estrutura e regras — e lembre
que ASO é **por idioma**: cada locale da Play Console tem a própria ficha, e
traduzir sem refazer a pesquisa de keywords desperdiça o campo.

## Saída — SEMPRE nesta ordem

Com a contagem de caracteres nos 4 primeiros itens:

1. Nome otimizado `(n/30)`
2. Título — 2–3 variações `(n/30)`
3. Descrição curta `(n/80)`
4. Descrição completa `(n/4000)`
5. Principais palavras-chave
6. Palavras-chave secundárias
7. Long Tail Keywords
8. Sugestões de melhorias
9. Nota ASO (0–100)
10. Justificativa da nota

Em **Sugestões de melhorias**, inclua o que o texto sozinho não resolve quando
for relevante: ícone, screenshots, vídeo, avaliações e velocidade de instalação
também pesam no ranqueamento — dizer isso evita a impressão de que só a cópia
decide posição.

## Nota ASO — como calcular

Some os critérios abaixo (mostre só o total e a justificativa, nunca a tabela):

| Critério                                      | Máx |
| --------------------------------------------- | --- |
| Cobertura de palavras-chave relevantes        | 25  |
| Naturalidade / ausência de stuffing           | 25  |
| Limites e políticas do Google Play            | 20  |
| Clareza e poder de conversão (CTA, benefício) | 20  |
| Diferenciação na categoria                    | 10  |

Na justificativa, diga o que sustentou a nota e o que faltou para chegar a 100.
