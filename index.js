'use strict'

const { scan, commands, diagnose, format, resolveOptions } = require('./src/scanner')
const { formatReport, formatCommands, formatDiagnosis } = require('./src/formatter')

module.exports = {
  name: '@theluxyi/docs',
  version: '1.0.0',
  scan,
  commands,
  diagnose,
  format,
  resolveOptions,
  formatReport,
  formatCommands,
  formatDiagnosis
}
