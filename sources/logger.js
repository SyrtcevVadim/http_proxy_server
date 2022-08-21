"use strict";
import fs from "node:fs";
import dateFormat from "dateformat";

export class Logger {
    constructor(pathToOutputFile) {
        this.pathToOutputFile = pathToOutputFile;
    }

    logToFile(requestDate, clientIpAddress, requestMethod, requestUrl) {
        fs.writeFile(this.pathToOutputFile, 
        `[${dateFormat(requestDate, "yyyy-mm-dd HH-MM-ss")}] ${clientIpAddress} ${requestMethod} ${requestUrl}\n`, 
        {
            flag: "a"
        },
        error => {
            if (error) {
                console.error(`Возникла ошибка при записи логов в файл: ${this.pathToOutputFile}`);
            }
        });
    }
}