import type { IExecuteFunctions } from 'n8n-workflow';
import type { Command } from 'overkiz-api';

function hexToRgb(hex: string): [number, number, number] {
	// Ensure the hex string has the # stripped off if it exists
	if (hex.charAt(0) === '#') {
		hex = hex.slice(1);
	}

	// Parse the r, g, b values
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return [r, g, b];
}

const genericOn = {
	value: 'genericOn',
	name: 'Turn On',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'on',
			parameters: [],
		},
	],
};

const genericOff = {
	value: 'genericOff',
	name: 'Turn Off',
	commands: (executionCtx: IExecuteFunctions): Command[] => [
		{
			name: 'off',
			parameters: [],
		},
	],
};

const genericSetRGBColor = {
	value: 'genericSetRGBColor',
	name: 'Set Color',
	commands: (executionCtx: IExecuteFunctions): Command[] => {
		const hexColor: string = executionCtx.getNodeParameter('color', 0) as string;

		return [
			{
				name: 'setRGB',
				parameters: hexToRgb(hexColor),
			},
		];
	},
};

export const lightsCommands = {
	DimmerLight: {
		commands: [genericOn, genericOff, genericSetRGBColor],
	},
	DimmerHueSatOrCTLight: {
		commands: [genericOn, genericOff, genericSetRGBColor],
	},
	DimmerColorTemperatureLight: {
		commands: [genericOn, genericOff, genericSetRGBColor],
	},
};
