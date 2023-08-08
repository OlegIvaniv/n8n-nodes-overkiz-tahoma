import type { IExecuteFunctions } from 'n8n-workflow';
import type { Command } from 'overkiz-api';

export const downAndCloseBlinds = {
	value: 'downAndCloseBlinds',
	name: 'Down & Close',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'down',
			parameters: [],
		},
		{
			name: 'close',
			parameters: [],
		},
	],
};

export const upAndOpenBlinds = {
	value: 'upAndOpenBlinds',
	name: 'Up & Open',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'up',
			parameters: [],
		},
		{
			name: 'open',
			parameters: [],
		},
	],
};

export const downBlinds = {
	value: 'downBlinds',
	name: 'Down',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'down',
			parameters: [],
		},
	],
};

export const upBlinds = {
	value: 'upBlinds',
	name: 'Up',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'up',
			parameters: [],
		},
	],
};

export const openBlinds = {
	value: 'openBlinds',
	name: 'Open',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'open',
			parameters: [],
		},
	],
};

export const closeBlinds = {
	value: 'closeBlinds',
	name: 'Close',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'close',
			parameters: [],
		},
	],
};

export const blindsCommands = {
	PositionableExteriorVenetianBlind: {
		commands: [upBlinds, downBlinds, openBlinds, closeBlinds, upAndOpenBlinds, downAndCloseBlinds],
	},
};
