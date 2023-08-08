# n8n-nodes-overkiz-tahoma
This is an n8n community node. It lets you use Overkiz (Tahoma) in your n8n workflows.

Overkiz (Tahoma) is a service for home automation that allows you to control various connected objects such as lights, blinds, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Resources](#resources)    

## Installation
Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations
The Overkiz (Tahoma) node supports the following operations:

- Get Many: Get many objects
- Get Single: Get a single object
- Get By Type: Get objects by type
- Execute Command: Executes a command on an object

Currently, there are only commands to control shutter blinds (PositionableExteriorVenetianBlind) and lights (DimmerLight, DimmerHueSatOrCTLight, DimmerColorTemperatureLight) because those are the only devices I have available for testing. 

However, contributions are welcome to extend the node with more commands for other devices. 

Please submit a PR if you would like to contribute.

## Credentials
To use the Overkiz (Tahoma) node, you need to authenticate with the Overkiz API. Sign up with Overkiz and obtain your hostname, email, and password. Then, set them up in the Overkiz API credentials in n8n.

## Compatibility
This node has been tested with n8n version 1.1.1. Backward compatibility with other versions is not guaranteed.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Overkiz API library](https://github.com/bbriatte/overkiz-api)
* [Somfy TaHoma local API](https://somfy-developer.github.io/Somfy-TaHoma-Developer-Mode/#/)

