import payload from 'payload';
import { CollectionConfig } from 'payload/types';
import { Level, List, Record, User } from '../generated/payload';
import { getPoints } from '../util';

/**
 * Hook that calculates and updates a User's score after the Records collection has been changed
 */
async function updateScore({ doc }: { doc: Record }) {
	const userId = (doc.user as User).id;

	// Get all Records of User
	const list = await payload.findGlobal<List>({
		slug: 'list',
	});

	// console.log(list);

	if (!list.levels) {
		return;
	}

	let score = 0;
	for (const [i, llevel] of list.levels.entries()) {
		const level = llevel.level as Level;
		const records = await payload.find<Record>({
			collection: 'records',
			limit: 2147483647,
			where: {
				and: [{ level: { equals: level.id } }, { user: { equals: userId } }],
			},
		});
		// Check if amount of found records is zero or one
		if (records.totalDocs > 1) {
			console.warn(
				`Found more than one record of user ${(doc.user as User).name} on ${level.name}`
			);
		}
		// Add points to score
		for (const record of records.docs) {
			score += getPoints(i + 1, level.requirement, record.percentage);
		}
		// Add verification
		if ((level.verifier as User).id === userId) {
			score += getPoints(i + 1, level.requirement, 100);
		}
	}

	// Attach score to User
	await payload.update({
		collection: 'users',
		id: userId,
		data: {
			score,
		},
	});
}

const Users: CollectionConfig = {
	slug: 'records',
	access: {
		read() {
			return true;
		},
	},
	admin: {
		useAsTitle: 'user',
		disableDuplicate: true,
		defaultColumns: ['user', 'level', 'percentage', 'video'],
	},
	hooks: {
		afterChange: [updateScore],
		afterDelete: [updateScore],
	},
	fields: [
		{
			name: 'user',
			type: 'relationship',
			relationTo: 'users',
			required: true,
		},
		{
			name: 'level',
			type: 'relationship',
			relationTo: 'levels',
			required: true,
		},
		{
			name: 'percentage',
			type: 'number',
			required: true,
			min: 1,
			max: 100,
			defaultValue: 100,
		},
		{
			name: 'video',
			type: 'text',
		},
	],
};

export default Users;
