import { promises } from 'fs';
import { Client } from 'discord.js';
import config from './util/config.js';
import { Cache } from './util/cache.js';
import verify from './commands/verify.js'
import checkreqs from './commands/checkreqs.js';
import { Intents } from 'discord.js';
import guildreqs from './commands/guildreqs.js';
import { bridgeReady, discordToMc, startMcClient } from './bridge.js';

class DragonBot {

    static cache;
    static discordClient;
    static mcClient;

    constructor() {
        this.initCache();
        this.initDiscord();
        this.initMcClient();
    }

    async initCache() {
        try {
            await promises.access(config.cacheLocation);
            this.cache = new Cache(await JSON.parse(await promises.readFile(config.cacheLocation, 'utf-8')));
        } catch (error) {
            console.log(error);
            this.cache = new Cache({ linked: [], members: [], profiles: [] });
        }
    }

    initDiscord() {
        this.discordClient = new Client({ intents: Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILDS });

        this.discordClient.on('ready', () =>     {
            console.log(`Logged in as ${this.discordClient.user.tag}!`);
        });

        this.discordClient.on('message', async msg => {
            if (!this.discordClient.application?.owner) await this.discordClient.application?.fetch();
            
            if (msg.content.toLowerCase() === '!deploy' && msg.author.id === this.discordClient.application?.owner.id) {
                await this.discordClient.guilds.cache.get('638935273694035990')?.commands.set(config.commands);
                console.log("Commands Deployed!");
            }

            await discordToMc(msg);
        });

        this.discordClient.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            switch (interaction.commandName) {
                case 'help':
                    // TODO: help
                    break;
                case 'verify':
                    await verify(interaction);
                    break;
                case 'check-requirements':
                    await checkreqs(interaction);
                    break;
                case 'guild-requirements':
                    await guildreqs(interaction);
                    break;
            }
        });

        this.discordClient.login(process.env.TOKEN);
    }

    initMcClient() {
        this.mcClient = startMcClient();
        setInterval(() => {
            this.mcClient.quit();
            bridgeReady = false;
            this.mcClient = startMcClient();
        }, config.bridge.mcTimeout);
    }
}

export let dragonBot = new DragonBot();