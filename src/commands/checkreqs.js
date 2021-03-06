import { MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import config from "../util/config.js";
import { errorEmbed } from "../util/embeds.js";
import { parseReqs, fetch, getLatestProfile, getPlayerFromName } from "../util/util.js"

export default async (interaction) => {
    interaction.defer();

    let player = await getPlayerFromName(interaction.options.get('name').value);

    if (player === '') {
        await interaction.editReply({
            embeds: [errorEmbed('`' + interaction.options.get('name').value + '`' + ' does not exist!\n Perhaps you misstyped a username?')]
        })
        return;
    }

    let profiles = (await fetch(config.hypixelApi.address, 'skyblock/profiles', { key: config.hypixelApi.key, uuid: player.id })).profiles;

    if (profiles == null) {
        await interaction.editReply({
            embeds: [errorEmbed('`' + player.name + '`' + ' has no profiles!\n Perhaps you misstyped a username?')]
        })
        return;
    }

    let requirements = interaction.options.get('requirements').value;

    let profile = getLatestProfile(profiles, player.id);

    await interaction.editReply(parseResults(player, profile, profiles, requirements));

    const filter = i => i.customId === 'selectProfileCheckReq';
	const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
        profile = profiles.find( p => p.cute_name === i.values[0]);
        try {
        await i.update(parseResults(player, profile, profiles, requirements));
        } catch (err) {
            console.error(err);
        }
    });

    collector.on('end', async () => {
        try {
            await interaction.editReply({ components: []});
        } catch (err) {
            console.error(err);
        }
    });
}

function parseResults(player, profile, profiles, requirements) {
    let results = parseReqs(requirements, profile?.members[player.id]);

    let embed = new MessageEmbed()
    .setColor('#00FF00')
    .setThumbnail('https://crafatar.com/avatars/' + player.id + '?overlay')
    .setTitle(player.name)
    .addField('Results for:', '\'`' + requirements.slice(0,64) + (requirements.length > 64 ? '...' : '') + '`\'')
    .setFooter(
        'Profile: ' + profile.cute_name + (profile?.game_mode === 'ironman' ? ' ???????' : '') + ' | ' + 
        'Last Played: ' + new Date(profile.members[player.id].last_save).toLocaleString()
    );

    for (const result of results) {
        if (!result.pass) {
            embed.setColor('#FF0000')
        }
        embed.addField(
            result.name + ':',
            (result.pass ? '????' : '????') + 
            (result.value == null ? '' : ' ' + result.value + '/' + result.requirement + ' ') +
            result.unit,
            true
        );
    }

    let rows;
    if (profiles.length > 1) {
        rows = [new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('selectProfileCheckReq')
                .addOptions(profiles.map( p => ({
                    label: p.cute_name + (p?.game_mode === 'ironman' ? ' ???????' : ''),
                    default: p.cute_name === profile.cute_name,
                    description: 'Last Online: ' + new Date(p.members[player.id].last_save).toLocaleString(),
                    value: p.cute_name,
                })))
            )];
    }

    return { embeds: [embed], components: rows };
}