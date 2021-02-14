import express, { Application, Request, Response, NextFunction } from 'express';
import { Server, Socket } from 'socket.io';
import * as http from 'http';

const port: number = parseInt(process.env.PORT || '5000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
 cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});
//io.attach(server);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.status(200).send('Hello, TS, im her');
});

io.on('connection', (socket: Socket) => {
	console.log('connection');
    socket.emit('status', 'Hello from Socket.io');
    
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId)
        console.log('joined room')
    })

	socket.on('disconnect', () => {
		console.log('client disconnected');
	});
});

server.listen(port, () => {
	console.log(`> Ready on http://localhost:${port}`);
});
