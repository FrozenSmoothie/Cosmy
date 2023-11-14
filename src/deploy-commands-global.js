const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../secrets/config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		try {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
				console.log(`Loaded command: ${command.data.name}`);
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
		catch (error) {
			console.error(`Error loading command from file ${file}:`, error);
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