import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OverkizApi implements ICredentialType {
	name = 'overkizApi';

	displayName = 'Overkiz API';

	documentationUrl = 'overkiz';

	properties: INodeProperties[] = [
		{
			displayName: 'Hostname',
			name: 'hostname',
			type: 'string',
			default: 'https://ha101-1.overkiz.com',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
