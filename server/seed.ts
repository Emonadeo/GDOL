import axios from 'axios';
import express from 'express';
import { writeFile, readFile } from 'fs/promises';
import payload from 'payload';

import { Level, List, User, Record } from './src/generated/payload';

const app = express();

// TODO: env variables null safety
payload.init({
	secret: process.env.PAYLOAD_SECRET!,
	mongoURL: process.env.DATABASE_URL!,
	express: app,
});

interface Player {
	id: number;
	name: string;
	banned: boolean;
}

interface Demon {
	name: string;
	position?: number;
	id: number;
	publisher: Player;
	verifier: Player;
	video?: string;
	requirement: number;
	level_id: number;
}

interface DemonFull extends Demon {
	creators: Player[];
	records: DemonRecord[];
}

interface DemonRecord {
	id: number;
	progress: number;
	video: string;
	status: string;
	demon: {
		id: number;
		position: number;
		name: string;
	};
	player: {
		id: number;
		name: string;
		banned: boolean;
	};
}

async function main() {
	console.log(`Start seeding...`);
	// const resMain = await axios.get('https://pointercrate.com/api/v2/demons/listed?limit=75');
	// const resExtended = await axios.get(
	// 	'https://pointercrate.com/api/v2/demons/listed?limit=75&after=75'
	// );
	// const data: Demon[] = resMain.data.concat(resExtended.data);
	const data: Demon[] = JSON.parse(
		await readFile('./generated/demons.json', { encoding: 'utf-8' })
	);

	// await writeFile('./generated/demons.json', JSON.stringify(data), { encoding: 'utf-8' });

	// Fetch full demons
	const demons: DemonFull[] = await Promise.all(
		data.map(async (demon) => {
			// const res = await axios.get(`https://pointercrate.com/api/v2/demons/${demon.id}`);
			// await writeFile(`./generated/${demon.name}.json`, JSON.stringify(res.data.data), {
			// 	encoding: 'utf-8',
			// });
			// return res.data.data;
			return JSON.parse(
				await readFile(`./generated/${demon.name}.json`, { encoding: 'utf-8' })
			);
		})
	);

	const levelMap = new Map<number, string>();
	for (const demon of demons) {
		const users: Player[] = [
			demon.publisher,
			demon.verifier,
			...demon.creators,
			...demon.records.map((r) => r.player),
		];
		const userMap = new Map<number, string>();
		for (const user of users) {
			// Check if user already exists
			const qry = await payload.find<User>({
				collection: 'users',
				where: { name: { equals: user.name } },
			});
			if (qry.totalDocs > 0) {
				userMap.set(user.id, qry.docs[0].id);
				continue;
			}
			// Create user if not exists
			const pUser = await payload.create<User>({
				collection: 'users',
				data: {
					name: user.name,
				},
			});
			userMap.set(user.id, pUser.id);
		}

		// Check if level already exists
		const qry = await payload.find<Level>({
			collection: 'levels',
			where: { gdId: { equals: demon.level_id } },
		});
		if (qry.totalDocs > 0) {
			levelMap.set(demon.level_id, qry.docs[0].id);
		} else {
			// Create level if not exists
			const pLevel = await payload.create<Level>({
				collection: 'levels',
				data: {
					name: demon.name,
					gdId: demon.level_id,
					requirement: demon.requirement,
					video: demon.video,
					user: userMap.get(demon.publisher.id),
					verifier: userMap.get(demon.verifier.id),
					creators: demon.creators.map((c) => userMap.get(c.id)),
				},
			});
			levelMap.set(demon.level_id, pLevel.id);
		}

		for (const record of demon.records) {
			// Check if record
			const qry = await payload.find<Record>({
				collection: 'records',
				where: {
					and: [
						{ user: { equals: userMap.get(record.player.id) } },
						{ level: { equals: levelMap.get(demon.level_id) } },
					],
				},
			});
			if (qry.totalDocs > 0) {
				continue;
			}
			// Create records if not exists
			await payload.create<Record>({
				collection: 'records',
				data: {
					level: levelMap.get(demon.level_id),
					user: userMap.get(record.player.id),
					percentage: record.progress,
					video: record.video,
				},
			});
		}
	}

	// Update List
	await payload.updateGlobal<List>({
		slug: 'list',
		data: {
			sections: [
				{
					name: 'Main List',
					length: 75,
				},
				{
					name: 'Extended List',
					length: 75,
				},
			],
			levels: demons.map((d) => ({ level: levelMap.get(d.level_id) })),
		},
	});

	console.log(`Seeding finished.`);
}

main();
