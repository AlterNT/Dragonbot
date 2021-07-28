import { dragonBot } from '../index.js';
import { getPlayerFromName } from "../util/util.js";
import { errorEmbed, successEmbed } from "../util/embeds.js";

export default async (interaction) => {
    await interaction.defer();

    let player = await getPlayerFromName(interaction.options.get('name').value);

    if (player === '') {
        await interaction.editReply({
            embeds: [errorEmbed('`' + interaction.options.get('name').value + '` does not exist!\n Perhaps you misstyped a username?')],
            ephemeral: true,
        })
        return;
    }

    let discordId = (await (await dragonBot.cache.getPlayer(player.id)).get(6000))?.socialMedia?.links?.DISCORD;

    console.log(discordId);

    if (discordId === undefined) {
        await interaction.editReply({
            embeds: [errorEmbed('`' + interaction.options.get('name').value + '` has no discord account linked!\n In a lobby go to: `My Profile -> Social Media -> Discord` to link your discord account!')],
            ephemeral: true,
        })
        return;
    } else if (discordId !== interaction.user.tag) {
        await interaction.editReply({
            embeds: [errorEmbed('`' + interaction.options.get('name').value + '` has the discord account `' + discordId + '` linked!\n Perhaps you misstyped your username?')],
            ephemeral: true,
        })
        return;
    } else {
        await interaction.editReply({
            embeds: [successEmbed('`' + interaction.options.get('name').value + '` has been successfully linked to the discord account `' + discordId + '`!')],
            ephemeral: true,
        })
        return;
    }
}