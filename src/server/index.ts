import * as WebSocket from 'ws';
import { Connection } from './net/connection';
import Coordinate from '_src/utils/coordinate';
import Point from '_src/utils/point';
// import World from './element/world';
// import { Player } from '_src/server/element/player';
const wss = new WebSocket.Server({ port: 8989 });

// const world = new World(5000, 5000);

wss.on('connection', (ws: any) => {
    const connection = new Connection(ws);
    ws.send('im server');
   
    // world.addPlayer(new Player(connection))
});