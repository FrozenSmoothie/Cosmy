/* eslint-disable no-inline-comments */
/* eslint-disable quotes */
/* eslint-disable indent */
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('node:path');

// Array of hex colors
const hexColors = [
	'#ff0000', // Red
	'#00ff00', // Green
	'#0000ff', // Blue
	'#ffff00', // Yellow
	'#ff00ff', // Magenta
	'#00ffff', // Cyan
	'#800080', // Purple
];

// Function to choose a random color from the array
function getRandomColor() {
	const randomIndex = Math.floor(Math.random() * hexColors.length);
	return hexColors[randomIndex];
}

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('comfort')
		.setDescription('Cosmy will give you comfort like hugs, cuddles, and more!')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('Choose an action to receive comfort')
				.setRequired(true)
				.addChoices(
					{ name: 'Hug', value: 'hug' },
					{ name: 'Cuddle', value: 'cuddle' },
					{ name: 'Nuzzle', value: 'nuzzle' },
					{ name: 'Love', value: 'love' },
					{ name: 'High Five', value: 'high_five' },
					{ name: 'Poke', value: 'poke' },
					{ name: 'Dance', value: 'dance' },
					{ name: 'Bounce', value: 'bounce' },
					{ name: 'Friend', value: 'friend' },
				))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('Whether or not the echo should be ephemeral')),

	async execute(interaction) {
		// Ephemeral or not? Default is false
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

		// Retrieve the chosen action
		const action = interaction.options.getString('action');

		// Choose random color
		const randomColor = getRandomColor();

		// Create an embed using EmbedBuilder
		const embed = new EmbedBuilder().setColor(randomColor);

		try {
			// Get the absolute path to the GIF folder
			const gifsFolderPath = path.join(__dirname, '../../data/healthData');

			// Customize embed based on the chosen action
			switch (action) {
				case 'hug':
					embed.setDescription(`Cosmic gives you a hug!`);
					break;
				case 'cuddle':
					embed.setDescription(`Cosmic cuddles up with you!`);
					break;
				case 'nuzzle':
					embed.setDescription(`Cosmic gently nuzzles you!`);
					break;
				case 'love':
					embed.setDescription(`Cosmic showers you with love!`);
					break;
				case 'high_five':
					embed.setDescription(`Cosmic gives you a high five!`);
					break;
				case 'poke':
					embed.setDescription(`Cosmic pokes you!`);
					break;
				case 'dance':
					embed.setDescription(`Cosmic dances with you!`);
					break;
				case 'bounce':
					embed.setDescription(`Cosmic bounces with you!`);
					break;
				case 'friend':
					embed.setDescription(`Cosmic takes you as their friend! >:3`);
					break;
				default:
					embed.setDescription('Invalid action.');
					break;
			}

			// Create AttachmentBuilder for the GIF file
			const gifFileName = `kirby-${action}.gif`;
			const gifFilePath = path.join(gifsFolderPath, gifFileName);
			const gifAttachment = new AttachmentBuilder(gifFilePath, { name: gifFileName });

			// Reply with the combined embed and attachment
			await interaction.reply({ embeds: [embed], files: [gifAttachment], ephemeral: ephemeral });
		}
		catch (error) {
			console.error('Error reading or attaching GIF file:', error);
			embed.setDescription('Error loading GIF. Please try again.');
			await interaction.reply({ embeds: [embed], ephemeral: ephemeral });
		}
	},
};