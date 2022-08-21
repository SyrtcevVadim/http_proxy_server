const http = require("node:http");
const config = require("config")

const STANDARD_HTTP_PORT = 80;

/*
    -----------------------------------------------------------
    Блок экспортирования имён из модуля
    -----------------------------------------------------------
*/
exports.startProxyServer = startProxyServer;

function requestListener(clientToProxy, proxyToClient) {
    let requestedUrlInfo = new URL(clientToProxy.url);
    console.log(`Запрошен адрес: ${requestedUrlInfo.host}`);
    console.log(`Метод: ${clientToProxy.method}`);
    console.log(`IP пользователя: ${clientToProxy.socket.remoteAddress}`);
    let proxyToServer = http.request({
        port: STANDARD_HTTP_PORT,
        host: requestedUrlInfo.host,
        path: requestedUrlInfo.url,
        method: requestedUrlInfo.method,
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

function onProxyServerStartup(message) {
    console.log(message);
}

function startProxyServer(hostAddress,listeningPort) {
    let proxyServer = http.createServer(requestListener);
    
    proxyServer.listen({
        port: listeningPort,
        host: hostAddress
    }, onProxyServerStartup(
        `Прокси сервер запущен.\nАдрес: ${hostAddress}:${listeningPort}`
    ));
}