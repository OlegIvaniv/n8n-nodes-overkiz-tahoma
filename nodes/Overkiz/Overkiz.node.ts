import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { capitalCase } from 'change-case';
import {
	getUsedUIClasses,
	getAllObjects,
	supportedDeviceTypes,
	getObjectAvailableCommands,
	getSingleObject,
} from './GenericFunctions';

export class Overkiz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Overkiz (Tahoma)',
		name: 'overkiz',
		icon: 'file:overkiz.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Overkiz (Tahoma) API',
		defaults: {
			name: 'Overkiz (Tahoma)',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'overkizApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Object',
						value: 'object',
					},
				],
				default: 'object',
				description: 'Resource to perform action upon in Overkiz API',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['object'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many objects',
						action: 'Get many objects',
					},
					{
						name: 'Get Single',
						value: 'getSingle',
						description: 'Get a single objects',
						action: 'Get a single objects',
					},
					{
						name: 'Get By Type',
						value: 'getByType',
						description: 'Get objects by type',
						action: 'Get By Type an object',
					},
					{
						name: 'Execute Command',
						value: 'executeCommand',
						description: 'Executes a command on object',
						action: 'Execute Command an object',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Object Type Name or ID',
				name: 'objectType',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAvailableTypes',
				},
				displayOptions: {
					show: {
						resource: ['object'],
						operation: ['getByType'],
					},
				},
				default: '',
				description:
					'List of available object types to filter. Multiples can be defined separated by comma. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Object Name or ID',
				name: 'objectURL',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAvailableObjects',
				},
				displayOptions: {
					show: {
						resource: ['object'],
						operation: ['executeCommand', 'getSingle'],
					},
				},
				default: '',
				description:
					'Object to perform action upon. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Command Name or ID',
				name: 'commandName',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getObjectCommands',
				},
				displayOptions: {
					show: {
						resource: ['object'],
						operation: ['executeCommand'],
					},
				},
				default: '',
				description:
					'Object to perform action upon. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '#ff0000',
				displayOptions: {
					show: {
						resource: ['object'],
						operation: ['executeCommand'],
						commandName: ['genericSetRGBColor'],
					},
				},
			},
		],
	};

	methods = {
		loadOptions: {
			async getAvailableTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const userClasses = await getUsedUIClasses.call(this);

				for (const usedClass of userClasses) {
					returnData.push({
						name: usedClass,
						value: usedClass,
					});
				}
				return returnData;
			},
			async getAvailableObjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const homeObjects = await getAllObjects.call(this);

				for (const homeObject of homeObjects) {
					if (supportedDeviceTypes.includes(homeObject.widget)) {
						returnData.push({
							name: `${homeObject.name} (${capitalCase(homeObject.definition.uiClass)})`,
							value: homeObject.URL,
						});
					}
				}
				return returnData;
			},
			async getObjectCommands(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const objectURL = this.getCurrentNodeParameter('objectURL') as string;

				const objectData = await getSingleObject.call(this, objectURL);
				if (!objectData || !supportedDeviceTypes.includes(objectData.widget)) return [];

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const commands = await getObjectAvailableCommands.call(this, objectData.widget);

				for (const command of commands) {
					returnData.push({
						name: command.name,
						value: command.value,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const credentials = await this.getCredentials('overkizApi');

		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials!');
		}

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i);
			const operation = this.getNodeParameter('operation', i);

			// Get all objects
			if (resource === 'object' && operation === 'getAll') {
				const objects = await getAllObjects.call(this);
				returnData.push(...objects.map((o) => ({ json: o })));

				return [this.helpers.returnJsonArray(returnData)];
			}

			// Get single object
			if (resource === 'object' && operation === 'getSingle') {
				const objectURL = this.getNodeParameter('objectURL', i) as string;
				const objectData = await getSingleObject.call(this, objectURL);
				returnData.push({ json: objectData });

				return [this.helpers.returnJsonArray(returnData)];
			}

			// Get objects by type
			if (resource === 'object' && operation === 'getByType') {
				const objectType = this.getNodeParameter('objectType', i) as string;
				const objects = await getAllObjects.call(this);

				const filteredObjects = objects.filter((o) => o.definition.uiClass === objectType);
				returnData.push(...filteredObjects.map((o) => ({ json: o })));

				return [this.helpers.returnJsonArray(returnData)];
			}

			// Execute command
			if (resource === 'object' && operation === 'executeCommand') {
				const objectURL = this.getNodeParameter('objectURL', i) as string;
				const commandName = this.getNodeParameter('commandName', i) as string;

				const objectData = await getSingleObject.call(this, objectURL);
				if (!objectData) return [this.helpers.returnJsonArray([])];
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const commands = await getObjectAvailableCommands.call(this, objectData.widget);
				const command = commands.find((c) => c.value === commandName);
				const execCommands = command?.commands(this) ?? [];

				if (!command || execCommands.length === 0) return [this.helpers.returnJsonArray([])];

				console.log('Execution command:', command.name, 'on object:', objectData.name);
				console.log('Object state before execution:', objectData.states);

				await objectData.exec(...execCommands);
				await objectData.refreshAll();

				return [this.helpers.returnJsonArray([{ json: objectData }])];
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
