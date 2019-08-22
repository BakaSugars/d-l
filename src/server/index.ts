import * as WebSocket from 'ws';
import { Connection } from './connection';

const wss = new WebSocket.Server({ port: 8989 });

wss.on('connection', (ws: any) => {
    const connection = new Connection(ws);
    ws.send('im server');
});