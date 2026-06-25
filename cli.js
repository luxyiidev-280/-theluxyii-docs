#!/usr/bin/env node
'use strict'

const path = require('path')
const luxDocs = require('./index')

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'help'

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  if (command === 'version' || command === '--version' || command === '-v') {
    console.log(luxDocs.version)
    return
  }

  const targetPath = resolveTargetPath(args)
  const json = args.includes('--json')
  const whatsapp = args.includes('--whatsapp')
  const config = readFlag(args, '--config')
  const commandsDir = readFlag(args, '--commands-dir')
  const mainFile = readFlag(args, '--main')
  const prefix = readFlag(args, '--prefix')
  const botName = readFlag(args, '--bot-name')
  const owner = readFlag(args, '--owner')

  const options = {
    root: targetPath,
    mode: whatsapp ? 'whatsapp' : 'text',
    config,
    commandsDir,
    mainFile,
    prefix,
    botName,
    owner
  }

  try {
    if (command === 'scan') {
      const report = await luxDocs.scan(options)
      if (json) console.log(JSON.stringify(report.json, null, 2))
      else console.log(whatsapp ? report.whatsappText : report.text)
      return
    }

    if (command === 'commands' || command === 'cmds') {
      const report = await luxDocs.commands(options)
      if (json) console.log(JSON.stringify(report.commands, null, 2))
      else console.log(whatsapp ? report.whatsappText : report.text)
      return
    }

    if (command === 'diagnose' || command === 'diagnostico' || command === 'diag') {
      const report = await luxDocs.diagnose(options)
      if (json) console.log(JSON.stringify(report, null, 2))
      else console.log(whatsapp ? report.whatsappText : report.text)
      return
    }

    console.error(`Comando desconhecido: ${command}`)
    printHelp()
    process.exitCode = 1
  } catch (error) {
    console.error(`Erro: ${error.message}`)
    process.exitCode = 1
  }
}

function resolveTargetPath(args) {
  const ignored = new Set(['scan', 'commands', 'cmds', 'diagnose', 'diagnostico', 'diag'])
  for (let index = 0; index < args.length; index++) {
    const value = args[index]
    if (!value || ignored.has(value)) continue
    if (value.startsWith('--')) {
      if (hasValueFlag(value)) index++
      continue
    }
    return path.resolve(process.cwd(), value)
  }
  return process.cwd()
}

function readFlag(args, flag) {
  const index = args.indexOf(flag)
  if (index === -1) return undefined
  return args[index + 1]
}

function hasValueFlag(flag) {
  return ['--config', '--commands-dir', '--main', '--prefix', '--bot-name', '--owner'].includes(flag)
}

function printHelp() {
  console.log(`@theluxyi/docs

Uso:
  luxdocs scan [pasta]
  luxdocs commands [pasta]
  luxdocs diagnose [pasta]

Opções:
  --json                 Mostra saída em JSON
  --whatsapp             Mostra saída formatada para WhatsApp
  --config <arquivo>     Usa um arquivo luxdocs.config.json personalizado
  --commands-dir <pasta> Define a pasta de comandos
  --main <arquivo>       Define o arquivo principal
  --prefix <prefixo>     Define o prefixo do bot
  --bot-name <nome>      Define o nome do bot
  --owner <nome>         Define o nome do dono/desenvolvedor

Exemplos:
  luxdocs scan .
  luxdocs scan . --whatsapp
  luxdocs commands . --json
  luxdocs diagnose . --commands-dir ./comandos
`)
}

main()
