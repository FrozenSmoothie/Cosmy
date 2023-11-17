const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../secrets/config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

// Commands to deploy globally
const commandsToDeploy = [
	'ping',
	'graph_bar',
	'mean',
	'comfort',
];

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		try {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			// Check if the command name is in the list of commands to deploy
			if ('data' in command && 'execute' in command && commandsToDeploy.includes(command.data.name)) {
				commands.push(command.data.toJSON());
				console.log(`Loaded and added command to deploy: ${command.data.name}`);
			}
			else {
				console.log(`Skipped command at ${filePath} (not in the list of commands to deploy).`);
			}
		}
		catch (error) {
			console.error(`Error loading command from file ${file}:`, error.message);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error('Error during command refresh:', error);
	}
})();