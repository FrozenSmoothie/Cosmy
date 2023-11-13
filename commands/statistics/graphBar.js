/* eslint-disable quotes */
/* eslint-disable no-inline-comments */
const { SlashCommandBuilder } = require('discord.js');
const QuickChart = require('quickchart-js');
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
		.setName('graph_bar')
		.setDescription('Makes a bar graph!'),
	async execute(interaction) {
		// Create the chart
		const chart = new QuickChart();
		chart.setConfig({
			type: 'bar',
			data: { labels: ['Hi', 'World'], datasets: [{ label: 'test', data: [1, 2] }] },
		});
		// choose random color
		const randomColor = getRandomColor();
		// create Embed
		const barGraphEmbed = new EmbedBuilder()
			.setColor(randomColor)
			.setTitle('Bar Graph')
			.setDescription("I've constructed a bar Graph for you using quickchart.io!")
			.setImage(chart.getUrl())
			.setTimestamp()
			.setFooter({ text: 'quickchart.io', iconURL: 'https://quickchart.io/' });
		// send graph
		await interaction.reply({ embeds: [barGraphEmbed] });
	},
};