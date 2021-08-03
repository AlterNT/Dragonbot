import mineflayer from 'mineflayer';
import { MessageEmbed } from 'discord.js';
import { RANKS } from './util/data.js';
import { fetch, sleep } from './util/util.js';
import { dragonBot } from './index.js';
import LeoProfanity from 'leo-profanity';
import config from './util/config.js';
import { bridgeEmbed, errorEmbed } from './util/embeds.js';

// MC Interface

const filter = LeoProfanity
    .add(['macro', 'hack', 'cheat', 'cheating', 'hael', 'hael9', 'bild', 'bildcore']);

export var bridgeReady = false;

export function startMcClient() {
    let client = mineflayer.createBot({
        host: 'mc.hypixel.net',
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        version: '1.16.5',
        auth: 'microsoft',
    });

    client.on('login', async () => {
        console.log('Joined Hypixel.');
        await sleep(1000);
        while (!bridgeReady) {
            client.chat('/');
            await sleep(Math.floor(Math.random() * 200 + 200));
        }
        console.log('Entered Limbo!');
        console.log('Ready to bridge!');
    });

    client.on('messagestr', async str => {
        if (str === 'You were spawned in Limbo.') bridgeReady = true;

        console.log(str);

        if (bridgeReady) {
            mcToDiscord(str);
        }
    });

    client.on('end', async () => {
        bridgeReady = false;
        await sleep(10000);
        startMcClient();
    });

    return client;
}

var lastmessage = 0;
const COOLDOWN = 500;

export async function discordToMc(msg) {
    if (msg.channel.id === config.discord.bridgeChannel) {
        if (bridgeReady && msg.author.id !== dragonBot.discordClient.user.id && msg.cleanContent !== '') {
            if (dragonBot.cache.discordLinked.has(msg.author.tag)) {
                if (Date.now() - lastmessage < COOLDOWN) {
                    await sleep((lastmessage + COOLDOWN) - Date.now());
                }
                lastmessage = Date.now();

                let mcId = dragonBot.cache.discordLinked.get(msg.author.tag);
                let name = (await (await dragonBot.cache.getPlayer(mcId)).get(3600000)).displayname;

                let text = msg.cleanContent.replaceAll('\n', ' ').replaceAll(/<(?=:\w)|(?<=\w:)\d*>/g, '');

                dragonBot.mcClient.chat(name + ' > ' + filter.clean(text));

                await msg.delete();
                await msg.channel.send({
                    embeds: [bridgeEmbed(name, text, mcId, '#9542F5')]
                });
                await dragonBot.discordClient.channels.cache.get(config.discord.logChannel).send({
                    embeds: [bridgeEmbed(name, text, mcId, '#9542F5')]
                });
            } else {
                await msg.reply({
                    embeds: [errorEmbed('Your discord account is not linked to a minecraft account! \n Please run `/verify` to link your account.')],
                    ephemeral: true,
                });
                await msg.delete();
            }
        }
    }
}

async function mcToDiscord(msg) {
    if (msg.includes('Guild > ') && msg.includes(':')) {
        let rank = msg.slice(8, msg.indexOf(':')).match(/(?<=\[)[A-Z+]{3,5}/)?.[0] ?? 'NON';
        let ign = msg.slice(8, msg.indexOf(':')).match(/\w*(?=.?\[?.?\]?$)/)[0];
        let text = msg.slice(msg.indexOf(':') + 2).replace(/<*@!*[A-z0-9]+>*/g, '\*\*\*\*');

        if (ign != 'DNDI') {
            let player = await fetch(config.mojangApi.address, 'users/profiles/minecraft/' + ign);

            await dragonBot.discordClient.channels.cache.get(config.discord.bridgeChannel).send({
                embeds: [bridgeEmbed(ign, text, player.id, RANKS[rank.replaceAll('+', 'PLUS')]?.color ?? '#FF0000')]
            });
            await dragonBot.discordClient.channels.cache.get(config.discord.logChannel).send({
                embeds: [bridgeEmbed(ign, text, player.id, RANKS[rank.replaceAll('+', 'PLUS')]?.color ?? '#FF0000')]
            });
        }
    }
}