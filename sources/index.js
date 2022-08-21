"use strict"
// В файле инициализации выставляются различные переменные окружения.
import "./environment_initialization.js";
import {ProxyServer} from "./proxyServer.js";
import {Logger} from "./logger.js";
import config from "config";

const hostAddress = config.get("ProxyServer.hostAddress");
const listeningPort = config.get("ProxyServer.listeningPort");

const loggingEnabled = config.get("Logger.loggingEnabled");
const logsDirectory = config.get("Logger.logsDirectory");
const logFileName = config.get("Logger.logFileName");

let proxyServer;
if (loggingEnabled) {
    let logger = new Logger(`${logsDirectory}/${logFileName}`);
    proxyServer = new ProxyServer(logger);
}
else {
    proxyServer = new ProxyServer();
}

proxyServer.start(hostAddress, listeningPort);