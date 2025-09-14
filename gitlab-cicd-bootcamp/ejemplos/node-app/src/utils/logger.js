/**
 * Logger simple para la aplicación
 */

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLevel = process.env.LOG_LEVEL || 'INFO';

function log(level, message, ...args) {
  if (logLevels[level] <= logLevels[currentLevel]) {
    const timestamp = new Date().toISOString();
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
    console.log(`[${timestamp}] ${level}: ${logMessage}`, ...args);
  }
}

function error(message, ...args) {
  log('ERROR', message, ...args);
}

function warn(message, ...args) {
  log('WARN', message, ...args);
}

function info(message, ...args) {
  log('INFO', message, ...args);
}

function debug(message, ...args) {
  log('DEBUG', message, ...args);
}

module.exports = {
  error,
  warn,
  info,
  debug,
  log
};