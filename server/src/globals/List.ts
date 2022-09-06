import payload from 'payload';
import { GlobalConfig } from 'payload/types';
import { Level, List, Record, User } from '../generated/payload';
import { getPoints } from '../util';

/**
 * Hook that calculates and updates all Users' scores after the List has been changed
 */
async function updateScores() {
	// Get all Records of User
	const list = await payload.findGlobal<List>({
		slug: 'list',
	});

	const userScores: { [userId: string]: number } = {};

	for (const [i, llevel] of list.levels.entries()) {
		const level = llevel.level as Level;
		const records = await payload.find<Record>({
			collection: 'records',
			limit: 2147483647,
			where: {
				and: [{ level: { equals: level.id } }],
			},
		});
		// Add verification
		const recordsAndVerifications: { user: User | string; percentage: number }[] = [
			...records.docs,
			{ user: level.verifier, percentage: 100 },
		];
		// Add points to score
		for (const record of recordsAndVerifications) {
			const userId = (record.user as User).id;
			userScores[userId] ??= 0;
			userScores[userId] += getPoints(i + 1, level.requirement, record.percentage);
		}
	}

	// Attach scores to Users
	await Promise.all(
		Object.entries(userScores).map(async ([userId, score]) => {
			await payload.update({
				collection: 'users',
				id: userId,
				data: {
					score,
				},
			});
		})
	);
}

const PList: GlobalConfig = {
	slug: 'list',
	access: {
		read() {
			return true;
		},
	},
	hooks: {
		afterChange: [updateScores],
	},
	fields: [
		{
			name: 'sections',
			type: 'array',
			required: true,
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'name',
							type: 'text',
							required: true,
						},
						{
							name: 'length',
							type: 'number',
							required: true,
						},
					],
				},
			],
		},
		{
			name: 'levels',
			type: 'array',
			required: true,
			fields: [
				{
					name: 'level',
					type: 'relationship',
					relationTo: 'levels',
					required: true,
				},
			],
		},
	],
};

export default PList;
