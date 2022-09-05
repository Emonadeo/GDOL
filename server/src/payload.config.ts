import { buildConfig } from 'payload/config';
import { resolve } from 'path';

import List from './globals/List';

import Users from './collections/Users';
import Levels from './collections/Levels';
import Staff from './collections/Staff';

export default buildConfig({
	serverURL: 'http://localhost:3000',
	admin: {
		user: Staff.slug,
	},
	globals: [List],
	collections: [Staff, Users, Levels],
	typescript: {
		outputFile: resolve(__dirname, './generated/payload.ts'),
	},
	graphQL: {
		schemaOutputFile: resolve(__dirname, './generated/payload.graphql'),
	},
	cors: '*',
});
