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

export function startMcClient(username, password) {
    let client = mineflayer.createBot({
        host: 'mc.hypixel.net',
        username: username,
        password: password,
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
        startMcClient(username, password);
    });

    return client;
}

var lastmessage = 0;
const COOLDOWN = 500;

export async function discordToMc(msg) {
    if (msg.channel.id === config.bridge.channel) {
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
                await dragonBot.discordClient.channels.cache.get(config.bridge.log).send({
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
        let rank = 'NON', ign, text;

        let identifiers = msg.slice(8, msg.indexOf(':')).replaceAll(/\[|\]/g, '').split(' ').map(s => s.trim());
        if (identifiers.length == 1) {
            ign = identifiers[0];
        } else {
            rank = identifiers[0];
            ign = identifiers[1]
        }

        // Replace things that make discord mad.
        text = msg.slice(msg.indexOf(':') + 2)[1];
        text.replace(/<*@!*[A-z0-9]+>*/g, '\*\*\*\*');
        text.replaceAll('`', '');

        if (ign != 'DNDI') {
            let player = await fetch(config.mojangApi.address, 'users/profiles/minecraft/' + ign);

            await dragonBot.discordClient.channels.cache.get(config.bridge.channel).send({
                embeds: [bridgeEmbed(ign, text, player.id, RANKS[rank.replaceAll('+', 'PLUS')]?.color ?? '#FF0000')]
            });
            await dragonBot.discordClient.channels.cache.get(config.bridge.log).send({
                embeds: [bridgeEmbed(ign, text, player.id, RANKS[rank.replaceAll('+', 'PLUS')]?.color ?? '#FF0000')]
            });
        }
    }
}