const { bgCyan, bgGreen, bgRed, bgYellow, cyan, green, red, yellow } = require('picocolors');


const logger = {
  ln: () => console.log(),
  withStartLn: (log) => {
    logger.ln();
    log();
  },
  withEndLn: (log) => {
    log();
    logger.ln();
  },
  withBothLn: (log) => {
    logger.ln();
    log();
    logger.ln();
  },
  warning: (msg) => {
    console.warn(`${bgYellow(' WARNING ')} ${yellow(msg)}`);
  },
  info: (msg) => {
    console.log(`${bgCyan(' INFO ')} ${cyan(msg)}`);
  },
  success: (msg) => {
    console.log(`${bgGreen(' SUCCESS ')} ${green(msg)}`);
  },
  error: (msg) => {
    console.error(`${bgRed(' ERROR ')} ${red(msg)}`);
  },
  warningText: (msg) => {
    console.warn(`${yellow(msg)}`);
  },
  infoText: (msg) => {
    console.log(`${cyan(msg)}`);
  },
  successText: (msg) => {
    console.log(`${green(msg)}`);
  },
  errorText: (msg) => {
    console.error(`${red(msg)}`);
  },
};


module.exports = {
  logger
}