import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { APIObject, Command } from 'overkiz-api';
import { API, DefaultLoginHandler } from 'overkiz-api';
import { lightsCommands } from './controllers/light';
import { blindsCommands } from './controllers/blinds';

// Singleton for API instance, keyed by email
const apiInstances: { [email: string]: API } = {};

const supportedDeviceCommands = {
	...blindsCommands,
	...lightsCommands,
};

export const supportedDeviceTypes = Object.keys(supportedDeviceCommands);

function simplifyObject(object: APIObject) {
	const simplifiedObject = {
		name: object.name,
		enabled: object.enabled,
		available: object.available,
		type: object.type,
		URL: object.URL,
		widget: object.widget,
		states: object.states,
		oid: object.oid,
		definition: object.definition,
		attributes: object.attributes,
		exec: async (...commands: Command[]) => object.exec(...commands),
		refresh: async (stateName: string) => object.refreshState(stateName),
		refreshAll: async () => object.refreshStates(),
		getStateValue: (stateName: string) => object.getStateValue(stateName),
	};

	return simplifiedObject;
}

export async function getOverkizApi(
	this: IExecuteFunctions | IPollFunctions | IHookFunctions | ILoadOptionsFunctions,
) {
	const credentials = await this.getCredentials('overkizApi');

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const hostname = credentials.hostname as string;
	const email = credentials.email as string;
	const password = credentials.password as string;

	const instantiatedApi = apiInstances[email];
	if (instantiatedApi) {
		return instantiatedApi;
	}


	const api = new API({
		host: hostname,
		polling: {
			always: false,
			interval: -1,
		},
		platformLoginHandler: new DefaultLoginHandler(email, password),
	});

	apiInstances[email] = api;

	return api;
}

export async function getAllObjects(
	this: IHookFunctions | IPollFunctions | ILoadOptionsFunctions | IExecuteFunctions,
) {
	const api = await getOverkizApi.call(this);
	const objects = await api.getObjects();

	return objects.map((object) => simplifyObject(object));
}

export async function getUsedUIClasses(
	this: IHookFunctions | IPollFunctions | ILoadOptionsFunctions | IExecuteFunctions,
) {
	const objects = await getAllObjects.call(this);

	const types = objects.map((object) => {
		const uiClass = object.definition.uiClass;

		return uiClass;
	});

	return [...new Set(types)];
}

export async function getSingleObject(
	this: IHookFunctions | IPollFunctions | ILoadOptionsFunctions | IExecuteFunctions,
	objectURL: string,
) {
	const objects = await getAllObjects.call(this);

	const foundObject = objects.find((object) => object.URL === objectURL);

	return foundObject;
}

export async function getObjectAvailableStates(
	this: IHookFunctions | IPollFunctions | ILoadOptionsFunctions | IExecuteFunctions,
	objectURL: string,
) {
	const object = await getSingleObject.call(this, objectURL);
	if (!object) return [];

	return object.definition.states;
}

export async function getObjectAvailableCommands(
	this: IHookFunctions | IPollFunctions | ILoadOptionsFunctions | IExecuteFunctions,
	objectUiClass: keyof typeof supportedDeviceCommands,
) {
	return supportedDeviceCommands[objectUiClass]?.commands ?? [];
}

export async function getObjectCurrentState(
	this: IHookFunctions | IPollFunctions | ILoadOptionsFunctions | IExecuteFunctions,
	objectURL: string,
) {
	const object = await getSingleObject.call(this, objectURL);
	if (!object) return [];

	return object.states;
}
