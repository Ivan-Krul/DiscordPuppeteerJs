const fs = require("fs");

function padZero2(num) {
  return ('0'+num).slice(-2);
}

function padZero4(num) {
  return ('000'+num).slice(-4);
}

function getDateFormat(date) {
  return `${padZero2(date.getHours())}:${padZero2(date.getMinutes())}:${padZero2(date.getSeconds())} | ${padZero2(date.getDate())}.${padZero2(date.getMonth() + 1)}.${date.getFullYear()}`;
}

const WriteLocation = {
  None: 'none',
  File: 'file',
  Console: 'cons',
  ConAndFile: 'both'
}

function Logger(filename, writeLocation) {
  this.needConsoleWrite = false;
  this.needFileWrite = false;
  
  switch(writeLocation) {
    case WriteLocation.File:
      this.needFileWrite = true;
      break;
    case WriteLocation.ConAndFile:
      this.needFileWrite = true;
    case WriteLocation.Console:
      this.needConsoleWrite = true;
      break;
  }
  
  this.name = filename;
  
  this.isStarted = false;
}

Logger.prototype.start = function () {
  this.isStarted = true;
  
  if(this.needFileWrite) {
    fs.writeFileSync(`${this.name}.log`, `Logging ${this.name} started at ${getDateFormat(new Date())}\n`, (err) => {
      if(!err) return;
      
      console.error(`starting to log is being interrupted for "${this.name}"`);
      this.isStarted = false;
    });
  }
}

const Priority = {
  Log: 'log  ',
  Info: 'info ',
  Warn: 'warn ',
  Error: 'error'
};

Logger.prototype.write = function (str, priority = Priority.Log) {
  var date = new Date();
  
  var readyString = `[${getDateFormat(date)}] ${priority}: ${str.replaceAll('\n', "\n                             : ")}`;
  
  if(this.needConsoleWrite) {
    switch(priority) {
      default:
      case Priority.Log:
        console.log(readyString);
        break;
      case Priority.Info:
        console.info(readyString);
        break;
      case Priority.Warn:
        console.warn(readyString);
        break;
      case Priority.Error:
        console.error(readyString);
        break;
    }
  }
  
  if(this.needFileWrite) {
    fs.appendFile(`${this.name}.log`, readyString + '\n', (err) => {
      if(!err) return;
      
      console.error(`starting to log is being interrupted for "${this.name}"`);
      this.isStarted = false;
    });
  }
}

Logger.prototype.close = function () {
  this.isStarted = false;
  
  if(this.needFileWrite) {
    this.fileWriter.end();
  }
}

module.exports = {
  Logger,
  Priority,
  WriteLocation
};
