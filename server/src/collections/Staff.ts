import { CollectionConfig } from 'payload/types';

const Staff: CollectionConfig = {
	slug: 'staff',
	auth: true,
	access: {
		read() {
			return true;
		},
	},
	admin: {
		useAsTitle: 'email',
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			unique: true,
		},
	],
};

export default Staff;
