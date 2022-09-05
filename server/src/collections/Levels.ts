import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
	slug: 'levels',
	admin: {
		useAsTitle: 'name',
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			admin: {
				placeholder: 'Chromatic Haze',
			},
		},
		{
			name: 'user',
			type: 'relationship',
			relationTo: 'users',
			required: true,
		},
		{
			name: 'verifier',
			type: 'relationship',
			relationTo: 'users',
			required: true,
		},
		{
			name: 'creators',
			type: 'relationship',
			hasMany: true,
			relationTo: 'users',
			required: true,
		},
		{
			name: 'gdId',
			label: 'Geometry Dash ID',
			type: 'number',
			required: true,
			admin: {
				placeholder: '62869408',
			},
		},
		{
			name: 'requirement',
			label: 'Required Percentage',
			type: 'number',
			required: true,
			defaultValue: 100,
		},
		{
			name: 'video',
			type: 'text',
			admin: {
				placeholder: 'https://www.youtube.com/watch?v=J-qEOHy-IIA',
			},
		},
	],
};

export default Users;
