---
name: build-release-stallion
description: Publica uma atualização OTA de JS no Stallion (build do bundle, upload, promoção de versão e ativação de rollout) — corrigindo erros de config, token e path em até 3 ciclos até o release ficar ativo. Use quando o usuário pedir "publicar update no Stallion", "subir OTA", "gerar release Stallion" ou invocar /build-release-stallion.
argument-hint: [rollout-percent] [app-version] | vazio usa os defaults do projeto
user-invocable: true
disable-model-invocation: false
model: claude-sonnet-4-6
---

# build-release-stallion

Publica uma atualização OTA (over-the-air) do bundle JS no Stallion para o app **DriverCash**, seguindo o fluxo de 3 comandos do `stallion-cli` (`publish-bundle` → `release-bundle` → `update-release`) já validado neste projeto.

## Quando usar

- Usuário pediu para publicar/subir uma atualização de JS via Stallion
- Usuário invocou `/build-release-stallion`
- Usuário descreveu uma mudança de código já testada e quer distribuí-la via OTA em vez de gerar um APK/AAB novo

**Não usar para:** mudanças que tocam código nativo, `app.json` (plugins/permissões), ou dependências nativas novas — essas exigem `expo prebuild` + rebuild do app e **não** podem ser distribuídas via Stallion (o SDK só troca o bundle JS, não o binário nativo).

## Contexto do projeto (não redescobrir a cada execução)

- **Organization slug**: `inovacode` (mesma conta/organização Stallion usada em outros apps deste usuário).
- **Project ID**: `6a74849356071e9ca6c794a5` (de `app.json` → `expo.plugins` → `expo-stallion-plugin` → `projectId`).
- **Project/bucket slug**: projeto `uber-gastos`, bucket `uber-gastos-bucket`.
- **Upload path completo**: `inovacode/uber-gastos/uber-gastos-bucket`.
- **Entry file real**: `node_modules/expo/AppEntry.js` — **nunca** o default do CLI (`index.js`). O `main` do `package.json` deste projeto é `node_modules/expo/AppEntry.js` (este app usa React Navigation, **não** Expo Router — não confundir com projetos irmãos que usam `expo-router/entry.js`).
- **App version**: ler de `app.json` → `expo.version` (hoje `1.0.0`) — **não confundir com `package.json` → `version`** (hoje `1.0.7`), que é só a versão do pacote npm e diverge da versão do app neste projeto. Sempre reconferir `app.json` antes de rodar `release-bundle`.
- **Dois tokens diferentes, não confundir**:
  - **CI token** (`stl_ap_...`): usado nos 3 comandos do CLI via `--ci-token`. É o que este skill usa.
  - **appToken** (`spb_...`): credencial de runtime, já configurada em `app.json` → `expo.plugins` → `expo-stallion-plugin` → `appToken`. **Não** é usado no CLI de release — só aparece se for necessário reconfigurar o SDK em si (fora do escopo deste skill).
- **Onde fica o CI token**: em `.env.local` na raiz (chave `STALLION_CI_TOKEN`). Este projeto ainda não tinha essa convenção — foi criado um `.env.example` versionado mostrando o formato, e o `.gitignore` foi atualizado para ignorar `.env.local`/`.env*.local` (antes só ignorava `.env`). Ler o token de lá em vez de pedir ao usuário:
  ```bash
  CI_TOKEN=$(grep -E '^STALLION_CI_TOKEN=' .env.local | cut -d= -f2-)
  ```
  Se `.env.local` não existir ou a chave estiver vazia, aí sim pedir o token ao usuário e oferecer criar/atualizar o `.env.local`. **Nunca** hardcodar o token no SKILL.md, em scripts, ou em qualquer arquivo versionado — o token é uma credencial sensível e o `.env.local` existe justamente para mantê-lo fora do Git.
- **`metro.config.js`** na raiz já existe, mas **não é** o `getDefaultConfig` puro — tem um `resolver.alias` custom para `react-native-google-mobile-ads` (contorna um export quebrado do pacote). Confirmar que existe antes de publicar; se sumiu, **não recriar com o template genérico** — restaurar preservando o alias:
  ```js
  const path = require("path");
  const { getDefaultConfig } = require("expo/metro-config");
  const config = getDefaultConfig(__dirname);
  config.resolver.alias = {
    ...(config.resolver.alias || {}),
    "react-native-google-mobile-ads": path.resolve(
      __dirname,
      "node_modules/react-native-google-mobile-ads/lib/commonjs/index.js",
    ),
  };
  module.exports = config;
  ```
  Recriar sem esse alias quebra a resolução do AdMob mesmo que o Metro suba normalmente.
- **Avisos de engine do Node** (`EBADENGINE` do `stallion-cli` pedindo Node 20+): tratar como ruído esperado a menos que o comando efetivamente falhe — não é um bloqueio conhecido.

## Como executar

### 1. Confirmar pré-requisitos antes de publicar

- `npx tsc --noEmit` deve passar (não publicar JS que não compila).
- Perguntar ao usuário (ou inferir do pedido) se a mudança já foi testada localmente (emulador/dispositivo). Este skill **não substitui** teste funcional — só automatiza a distribuição.
- Confirmar que `metro.config.js` existe na raiz **com o alias do `react-native-google-mobile-ads`** (ver seção acima). Se não existir, recriar antes de prosseguir.
- Ler `app.json` → `expo.version` para saber o `--app-version` a usar em `release-bundle`.
- **Obter o CI token**: primeiro tentar ler de `.env.local` (`grep -E '^STALLION_CI_TOKEN=' .env.local | cut -d= -f2-`). Se existir e não estiver vazio, usar esse — sem pedir ao usuário. Se não existir, pedir o token, e após recebê-lo oferecer gravá-lo em `.env.local` (nunca em arquivo versionado). **Nunca** inventar ou reutilizar de memória um token que não veio do `.env.local` ou do usuário nesta sessão — tokens podem ser rotacionados/revogados. Se o CLI acusar token inválido, o token no `.env.local` pode estar velho: pedir um novo ao usuário e atualizar o arquivo.

### 2. Publicar o bundle (`publish-bundle`)

```bash
npx --yes stallion-cli publish-bundle \
  --upload-path=inovacode/uber-gastos/uber-gastos-bucket \
  --platform=android \
  --release-note="<descrição curta da mudança>" \
  --entry-file=node_modules/expo/AppEntry.js \
  --ci-token=<CI_TOKEN>
```

Capturar o `Published bundle hash: <hash>` da saída — é necessário para os próximos dois passos. Rodar em background (o build do bundle + conversão Hermes pode levar 1-3 min) e aguardar a notificação de conclusão em vez de fazer polling manual.

### 3. Promover o bundle para uma versão de app (`release-bundle`)

```bash
npx --yes stallion-cli release-bundle \
  --project-id=6a74849356071e9ca6c794a5 \
  --hash=<hash do passo 2> \
  --app-version=<versão de app.json> \
  --release-note="<mesma descrição>" \
  --ci-token=<CI_TOKEN>
```

### 4. Ativar o rollout (`update-release`)

**Antes de rodar**, confirmar com o usuário via pergunta direta (não assumir):

- Percentual de rollout (100% é o padrão para primeira publicação de uma feature já validada; um valor menor como 20% é mais prudente para mudanças arriscadas).
- Se o update deve ser `--is-mandatory` (força atualização imediata) — no geral, **não** marcar mandatório sem o usuário pedir explicitamente, pois isso pode interromper o uso do app para forçar o update.

```bash
npx --yes stallion-cli update-release \
  --project-id=6a74849356071e9ca6c794a5 \
  --hash=<hash do passo 2> \
  --rollout-percent=<confirmado com o usuário> \
  --is-mandatory=<confirmado com o usuário> \
  --is-paused=false \
  --ci-token=<CI_TOKEN>
```

## Loop de validação (até 3 ciclos)

### Interpretar erros

| Sinal na saída                                                    | Diagnóstico provável                                                                                                       | Correção                                                                                                                                                                                                    |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `No Metro config found in <path>`                                 | Falta `metro.config.js` na raiz (Stallion CLI usa `react-native bundle` bruto, que exige o arquivo mesmo em projetos Expo) | Restaurar `metro.config.js` **com o alias do google-mobile-ads** (ver seção Contexto) e reexecutar `publish-bundle`                                                                                    |
| `appToken must start with "spb_"`                                 | Token errado passado como appToken — provavelmente o CI token (`stl_ap_...`) foi usado no lugar do runtime token           | Esse erro é do **prebuild do SDK**, não do CLI de release — não deveria aparecer neste fluxo; se aparecer, algo fora do escopo deste skill foi alterado. Reportar ao usuário, não adivinhar qual token usar |
| `HTTP error code: 400` (em runtime, não no CLI)                   | appToken de runtime não corresponde ao `projectId`, ou token pertence a outro projeto do usuário                           | Fora do escopo do CLI de release — é um problema de configuração do SDK (`app.json`), não deste comando. Reportar e sugerir conferir Project Settings → Access Tokens no console                            |
| CLI retorna erro de autenticação/token inválido                   | CI token expirado, revogado, ou pertence a outro projeto                                                                   | Perguntar ao usuário se o token ainda é válido no console (Project Settings → Access Tokens) — nunca tentar tokens antigos de memória/sessões anteriores sem confirmação                                    |
| `release-bundle` falha dizendo hash não encontrado                | Hash copiado errado do output do `publish-bundle`, ou o publish anterior falhou silenciosamente                            | Reconferir a saída completa do passo 2; se necessário, rodar `publish-bundle` de novo e recapturar o hash                                                                                                   |
| `Bundle released successfully!` / `Release updated successfully!` | Sucesso — passo concluído                                                                                                  | Prosseguir para o próximo comando ou reportar conclusão                                                                                                                                                     |
| Erro de rede / timeout no upload                                  | Instabilidade de conexão, não um bug de config                                                                             | Reexecutar o mesmo comando (o `publish-bundle` não é destrutivo em caso de retry)                                                                                                                           |

### Aplicar correções

Corrigir **somente** a causa raiz identificada na tabela acima. Depois de cada correção, repetir o comando que falhou (não é necessário re-rodar passos anteriores que já tiveram sucesso, exceto se o hash mudou).

### Limite de tentativas

Após **3 ciclos** sem que os 3 comandos completem com sucesso:

- Reportar exatamente qual comando falhou e o erro completo retornado.
- Explicar a causa provável (usando a tabela acima como referência).
- **Não inventar valores** (tokens, hashes, paths) para forçar uma tentativa a mais — se a causa exige uma decisão ou dado que só o usuário tem (token revogado, slug incerto), parar e perguntar.

## Formato da resposta final

1. **Pré-checagem** — resultado de `tsc --noEmit`, confirmação de que `metro.config.js` existe (com o alias), versão de app lida de `app.json`.
2. **Resultado de cada comando** — hash publicado, confirmação de promoção de versão, percentual/mandatoriedade do rollout ativado.
3. **Resumo do release**: hash, versão de app, rollout percent, mandatório ou não.
4. Se algo falhou: listar o comando, o erro exato, e o próximo passo manual sugerido.

## Anti-patterns a evitar

- Rodar `update-release` com `--is-mandatory=true` sem confirmação explícita do usuário.
- Reutilizar um CI token de uma conversa anterior sem confirmar que ainda é válido — tokens podem ser revogados/rotacionados entre sessões.
- Publicar um bundle sem rodar `tsc --noEmit` antes.
- Usar `--entry-file` default (`index.js`) ou o de outro projeto (`expo-router/entry.js`) — sempre `node_modules/expo/AppEntry.js` neste projeto.
- Recriar `metro.config.js` sem o alias do `react-native-google-mobile-ads` — quebra o AdMob.
- Publicar mudanças que tocam `app.json`, plugins nativos, ou dependências nativas novas via Stallion — essas exigem rebuild do app, não OTA.
- Assumir rollout-percent/mandatory sem perguntar — sempre confirmar antes do `update-release`, que é o passo que efetivamente afeta usuários reais.

## Exemplo de invocação

```
/build-release-stallion
```

ou, especificando parâmetros:

```
/build-release-stallion 20% 1.0.0

Acabei de corrigir um bug no cálculo do lucro do dashboard, quero publicar via OTA antes de gerar um AAB novo.
```
