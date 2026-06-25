# @theluxyi/docs

Módulo universal para gerar **informações, documentação e diagnóstico** de bots WhatsApp em Node.js.

Ele analisa o projeto do usuário de forma estática, sem executar o código do bot, e gera um relatório com dados como:

- nome, versão e licença do projeto;
- engine detectada, como Baileys;
- comandos encontrados em `case`, plugins e exports;
- dependências do `package.json`;
- estrutura básica de arquivos;
- database provável;
- sessão Baileys provável;
- sistemas detectados, como antilink, welcome, dono, admin, premium e sticker;
- avisos de segurança;
- sugestões de melhoria;
- texto pronto para enviar no WhatsApp.

## Instalação

```bash
npm install @theluxyi/docs
```

## Uso básico em Node.js

```js
const luxDocs = require('@theluxyi/docs')

async function main() {
  const report = await luxDocs.scan({
    root: process.cwd()
  })

  console.log(report.text)
}

main().catch(console.error)
```

Saída aproximada:

```txt
@theluxyi/docs

Projeto: meu-bot
Versão: 1.0.0
Runtime: Node.js v20.x
Engine: Baileys
Prefixo: !
Comandos: 84
Dependências: 21
Arquivos analisados: 122
Database: JSON
Sessão: detectada
Risco: baixo (15/100)
```

## Uso dentro de bot WhatsApp

Exemplo em handler com `case`:

```js
const luxDocs = require('@theluxyi/docs')

case 'infos':
case 'botinfo':
case 'docsinfo': {
  try {
    const report = await luxDocs.scan({
      root: process.cwd(),
      mode: 'whatsapp',
      ignore: ['node_modules', '.git', 'session', 'temp']
    })

    reply(report.whatsappText)
  } catch (err) {
    reply(`Erro ao gerar informações do bot:\n\n${err.message}`)
  }
}
break
```

O usuário digita:

```txt
!infos
```

O bot responde algo assim:

```txt
╭━━〔 THE LUXYI DOCS 〕━━
┃ Projeto: lux-bot
┃ Versão: 1.0.0
┃ Engine: Baileys
┃ Prefixo: !
┃ Developer: The Luxyii
┃ Comandos: 84
┃ Dependências: 21
┃ Arquivos: 122
┃ Database: JSON
┃ Sessão: detectada
┃ Risco: baixo (15/100)
╰━━━━━━━━━━━━━━━━━━
```

## Uso via terminal

Depois de instalar globalmente ou usar `npx`:

```bash
npx @theluxyi/docs scan .
```

Com saída formatada para WhatsApp:

```bash
npx @theluxyi/docs scan . --whatsapp
```

Listar comandos detectados:

```bash
npx @theluxyi/docs commands .
```

Gerar diagnóstico:

```bash
npx @theluxyi/docs diagnose .
```

Gerar JSON:

```bash
npx @theluxyi/docs scan . --json
```

## Configuração opcional

Crie um arquivo `luxdocs.config.json` na raiz do projeto:

```json
{
  "botName": "Meu Bot",
  "owner": "The Luxyii",
  "prefix": "!",
  "commandsDir": "./comandos",
  "mainFile": "./index.js",
  "ignore": [
    "node_modules",
    ".git",
    "session",
    "temp",
    "logs"
  ]
}
```

Depois use normalmente:

```js
const luxDocs = require('@theluxyi/docs')

async function main() {
  const report = await luxDocs.scan({
    root: process.cwd()
  })

  console.log(report.whatsappText)
}

main()
```

## API

### `scan(options)`

Analisa o projeto inteiro.

```js
const report = await luxDocs.scan({
  root: process.cwd(),
  mode: 'whatsapp'
})
```

Retorna:

```js
{
  project: {},
  bot: {},
  commands: [],
  security: {},
  runtime: {},
  suggestions: [],
  text: '',
  whatsappText: '',
  json: {}
}
```

### `commands(options)`

Retorna apenas os comandos detectados.

```js
const result = await luxDocs.commands({
  root: process.cwd()
})

console.log(result.whatsappText)
```

### `diagnose(options)`

Retorna diagnóstico e avisos de segurança.

```js
const result = await luxDocs.diagnose({
  root: process.cwd()
})

console.log(result.whatsappText)
```

### `format(report, options)`

Formata um relatório já gerado.

```js
const report = await luxDocs.scan({ root: process.cwd() })
const text = luxDocs.format(report, { type: 'whatsapp' })

console.log(text)
```

## Opções

| Opção | Tipo | Função |
|---|---:|---|
| `root` | `string` | Pasta raiz do projeto analisado |
| `mode` | `string` | `text`, `whatsapp` ou `json` |
| `config` | `string` | Caminho do arquivo de configuração |
| `commandsDir` | `string` | Pasta onde ficam os comandos |
| `mainFile` | `string` | Arquivo principal do bot |
| `botName` | `string` | Nome manual do bot |
| `owner` | `string` | Nome manual do dono/dev |
| `prefix` | `string` | Prefixo manual do bot |
| `ignore` | `string[]` | Pastas/arquivos ignorados |
| `maxFiles` | `number` | Limite máximo de arquivos analisados |
| `maxFileSize` | `number` | Limite de tamanho por arquivo |

## O que ele detecta

### Comandos por `case`

```js
case 'play':
case 'p': {
  reply('tocando música')
}
break
```

### Comandos por export

```js
module.exports = {
  name: 'sticker',
  aliases: ['s'],
  category: 'midia',
  run: async () => {}
}
```

### Comandos por array

```js
exports.command = ['menu', 'help']
exports.category = 'geral'
```

## Segurança

O módulo faz análise estática. Ele não executa o código do projeto analisado.

Ele pode avisar sobre:

- possíveis tokens hardcoded;
- uso de `eval`;
- uso de `child_process`;
- ausência provável de checks de dono/admin;
- ausência provável de cooldown/rate-limit.

Esses avisos são heurísticos. Eles ajudam no diagnóstico, mas não substituem auditoria manual.

## Licença

MIT License.

Developer: The Luxyii.
