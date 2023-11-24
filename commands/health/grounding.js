/* eslint-disable no-inline-comments */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('grounding')
		.setDescription('Helps calming you down <3'),
	async execute(interaction) {
		let step = 1; // Initialize the step variable

		const nextButton = new ButtonBuilder()
			.setCustomId('next')
			.setLabel('Next')
			.setStyle(ButtonStyle.Success); // Set the style to green

		const backButton = new ButtonBuilder()
			.setCustomId('back')
			.setLabel('Back')
			.setStyle(ButtonStyle.Success); // Set the style to green

		const endButton = new ButtonBuilder()
			.setCustomId('end')
			.setLabel('End')
			.setStyle(ButtonStyle.Secondary); // Set the style to gray

		const row = new ActionRowBuilder().addComponents(nextButton, backButton, endButton); // Add the buttons in the desired order

		const response = await interaction.reply({
			content: `Step ${step}`, // Initial content
			components: [row],
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		const updateMessage = async () => {
			await response.edit({ content: `Step ${step}`, components: [row] });
		};

		try {
			const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60_000 });

			collector.on('collect', async (i) => {
				i.deferUpdate(); // Defer the update here
				if (i.customId === 'next' && step < 5) {
					step++;
					await updateMessage();
				}
				else if (i.customId === 'back' && step > 1) {
					step--;
					await updateMessage();
				}
				else if (i.customId === 'end') {
					await response.delete(); // Delete the embed if "End" is pressed
				}
			});

			collector.on('end', async () => {
				await response.edit({ content: 'Action canceled', components: [] });
			});
		}
		catch (e) {
			await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
		}
	},
};