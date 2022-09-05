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
	],
};

export default Users;
