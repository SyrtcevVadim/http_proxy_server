"use strict"
// В файле инициализации выставляются различные переменные окружения.
import "./environment_initialization.js";
import {ProxyServer} from "./proxyServer.js";
import {Logger} from "./logger.js";
import {cpus} from "node:os";
import cluster from "node:cluster";
import config from "config";


const hostAddress = config.get("ProxyServer.hostAddress");
const listeningPort = config.get("ProxyServer.listeningPort");

const loggingEnabled = config.get("Logger.loggingEnabled");
const logsDirectory = config.get("Logger.logsDirectory");
const logFileName = config.get("Logger.logFileName");

const LOGICAL_CPU_CORE_QUANTITY = cpus().length;
if (cluster.isPrimary) {
    for (let process_number = 0; process_number < LOGICAL_CPU_CORE_QUANTITY; process_number++) {
        cluster.fork();
    }
} else {
    let proxyServer;
    if (loggingEnabled) {
        let logger = new Logger(`${logsDirectory}/${logFileName}`);
        proxyServer = new ProxyServer(logger);
    }
    else {
        proxyServer = new ProxyServer();
    }

    proxyServer.start(hostAddress, listeningPort);
}

