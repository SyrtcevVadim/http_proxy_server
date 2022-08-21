"use strict";
import http from "node:http";
import {Logger} from "./logger.js";

const STANDARD_HTTP_PORT = 80;

/*
    Обёртка над объектом http.Server (или https.Server);
*/
export class ProxyServer {
    constructor(logger = null) {
        this.logger = logger;
        this.proxyServer = null;
    }

    start(hostAddress, listeningPort) {
        if (this.proxyServer != null) {
            console.log("Прокси сервер уже запущен!");
        } else {
            // Чтобы в requestListener можно было бы использовать this, нужно вызывать эту функцию через arrow-function () => {}
            this.proxyServer = http.createServer((clientToProxy, proxyToClient) => {
                this.requestListener(clientToProxy, proxyToClient);
            });
        
            this.proxyServer.on("close", this.onProxyServerShutdown);
        
            this.proxyServer.listen({
                port: listeningPort,
                host: hostAddress
                }, 
                this.onProxyServerStartup(`Прокси сервер запущен.\nАдрес: ${hostAddress}:${listeningPort}`)
            );
        }
    }

    requestListener(clientToProxy, proxyToClient) {
        let requestedUrlInfo = new URL(clientToProxy.url);
        if (this.logger != null) {
            this.logger.logToFile(
                Date.now(), 
                clientToProxy.socket.remoteAddress,
                clientToProxy.method,
                clientToProxy.url);
        }
        let proxyToServer = http.request({
            port: STANDARD_HTTP_PORT,
            host: requestedUrlInfo.host,
            path: clientToProxy.url,
            method: clientToProxy.method,
            headers: requestedUrlInfo.headers
        }, (serverToProxy) => {
            proxyToClient.writeHead(serverToProxy.statusCode, serverToProxy.headers);
            serverToProxy.pipe(proxyToClient, {
                end: true
            });
        });
    
        clientToProxy.pipe(proxyToServer, {
            end: true
        });
    }
    
    onProxyServerStartup(message) {
        console.log(message);
    }

    onProxyServerShutdown(errorMessage) {
        console.log("Прокси сервер прекратил свою работу");
        console.log(errorMessage);
    }
}