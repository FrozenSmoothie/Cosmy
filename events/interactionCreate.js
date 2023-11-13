const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Map());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return interaction.reply({
					content: `Please wait ${timeLeft.toFixed(1)} more seconds before using \`${
						command.name
					}\` again.`,
					ephemeral: true,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			return interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};