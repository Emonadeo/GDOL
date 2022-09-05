import express from 'express';
import payload from 'payload';
import cors from 'cors';

const app = express();

app.use(cors());

// TODO: env variables null safety
payload.init({
	secret: process.env.PAYLOAD_SECRET!,
	mongoURL: process.env.DATABASE_URL!,
	express: app,
});

app.listen(3000, async () => {
	console.log('Express is now listening for incoming connections on port 3000.');
});
