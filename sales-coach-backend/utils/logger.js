import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, 'logs');
if(!fs.existsSync(logDirectory)){
    fs.mkdirSync(logDirectory);
}

const logFilePath = path.join(__dirname, '../logs/app.log');

function logMessage(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;

    // Print to console
    console.log(logEntry.trim());

    // Append to log file
    fs.appendFileSync(logFilePath, logEntry, { encoding: 'utf8' });
}

function logError(error) {
    const timestamp = new Date().toISOString();
    const errorEntry = `[${timestamp}] [ERROR] ${error.stack || error.message}\n`;

    // Print to console
    console.error(errorEntry.trim());

    // Append to log file
    fs.appendFileSync(logFilePath, errorEntry, { encoding: 'utf8' });
}

export { logMessage, logError };
