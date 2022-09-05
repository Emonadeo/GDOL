import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
	slug: 'users',
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
			name: 'records',
			type: 'array',
			fields: [
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
					required: true,
				},
			],
		},
	],
};

export default Users;
