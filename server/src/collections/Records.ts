import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
	slug: 'records',
	access: {
		read() {
			return true;
		},
	},
	admin: {
		useAsTitle: 'video',
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
			unique: true,
		},
	],
};

export default Users;
