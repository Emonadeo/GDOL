import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
	slug: 'users',
	access: {
		read() {
			return true;
		},
	},
	admin: {
		useAsTitle: 'name',
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			unique: true,
		},
		{
			name: 'nationality',
			type: 'text',
		},
		{
			name: 'score',
			type: 'number',
			// hidden: true,
			defaultValue: 0,
		},
	],
};

export default Users;
