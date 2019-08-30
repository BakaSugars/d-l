import * as WebSocket from 'ws';
import { Connection } from './net/connection';
import World from './element/world';

const wss = new WebSocket.Server({ port: 8989 });

const world = new World(5000, 5000);

wss.on('connection', (ws: any) => {
    const connection = new Connection(ws);
    ws.send('im server');
});