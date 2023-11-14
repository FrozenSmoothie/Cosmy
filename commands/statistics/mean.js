const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const path = require('path');
const config = require('./../../secrets/config.json');
const meanScriptPath = path.join(__dirname, '../../scripts/mean.R');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('mean')
		.setDescription('Calculate the mean from input numbers')
		.addNumberOption(option =>
			option.setName('number1')
				.setDescription('First number')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('number2')
				.setDescription('Second number')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('number3')
				.setDescription('Third number')
				.setRequired(true)),
	async execute(interaction) {
		const number1 = interaction.options.getNumber('number1');
		const number2 = interaction.options.getNumber('number2');
		const number3 = interaction.options.getNumber('number3');

		try {
			// Access the Rscript path from the configuration
			const rscriptPath = config.rscriptPath;

			// Execute the R script with the provided numbers
			exec(`${rscriptPath} ${meanScriptPath} ${number1} ${number2} ${number3}`, (error, stdout, stderr) => {
				if (error) {
					console.error(`Error executing R script: ${stderr}`);
					return interaction.reply('Error executing the R script.');
				}
				const result = stdout.trim();
				return interaction.reply(`Mean: ${result}`);
			});
		}
		catch (error) {
			console.error(error);
			await interaction.reply('Error executing the R script.');
		}
	},
};