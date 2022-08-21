"use strict"
const initialization = require("./initialization.js");
const proxyServer = require("./proxyServer.js");
const config = require("config");

const hostAddress = config.get("ProxyServer.hostAddress");
const listeningPort = config.get("ProxyServer.listeningPort");

proxyServer.startProxyServer(hostAddress, listeningPort);