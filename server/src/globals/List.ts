import { GlobalConfig } from 'payload/types';

const List: GlobalConfig = {
	slug: 'list',
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

export default List;
