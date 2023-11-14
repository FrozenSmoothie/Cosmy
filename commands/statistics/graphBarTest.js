/* eslint-disable quotes */
/* eslint-disable no-inline-comments */
const { SlashCommandBuilder } = require('discord.js');
const QuickChart = require('quickchart-js');
require('chartjs-plugin-datalabels');
const { EmbedBuilder } = require('discord.js');

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
		.setName('graph_bar_test')
		.setDescription('Makes a bar graph!')
		// options
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Title of the graph')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('label1')
				.setDescription('Bar 1 label')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('number1')
				.setDescription('Bar 1 value (type: number)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('label2')
				.setDescription('Bar 2 label')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('number2')
				.setDescription('Bar 2 value (type: number)')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('Whether or not the echo should be ephemeral')),
	async execute(interaction) {
		// retrieving option choice
		const title = interaction.options.getString('title');
		const label1 = interaction.options.getString('label1');
		const label2 = interaction.options.getString('label2');
		const number1 = interaction.options.getNumber('number1');
		const number2 = interaction.options.getNumber('number2');
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
		// Check if the values are valid numbers
		if (isNaN(number1) || isNaN(number2)) {
			return interaction.reply({
				content: 'Please provide valid numeric values for Bar 1 and Bar 2.',
				ephemeral: true,
			});
		}
		// Create the chart
		const chart = new QuickChart();
		chart.setConfig({
			type: 'bar',
			data: {
				labels: [`${label1}`, `${label2}`],
				datasets: [
					{
						data: [number1, number2],
						datalabels: {
							anchor: 'end',
							align: 'end',
							display: true,
						},
					},
				],
			},
			options: {
				title: {
					display: true,
					text: `${title}`,
				},
				plugins: {
					datalabels: {
						display: false, // Set to false to hide global datalabels options
					},
				},
				legend: {
					display: false,
				},
			},
		});
		// choose random color
		const randomColor = getRandomColor();
		// create Embed
		const barGraphEmbed = new EmbedBuilder()
			.setColor(randomColor)
			.setTitle('Bar Graph')
			.setDescription("I've constructed your bar graph using quickchart.io!")
			.setImage(chart.getUrl())
			.setTimestamp()
			.setFooter({ text: 'reference: quickchart.io' });
		// send graph
		await interaction.reply({ embeds: [barGraphEmbed], ephemeral: ephemeral });
	},
};