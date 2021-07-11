import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'discord.js';
import config from './config.js';
import checkreqs from './commands/checkreqs.js';
import { Intents } from 'discord.js';

const client = new Client({ intents: Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILDS });

client.on('ready', () =>     {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (!client.application?.owner) await client.application?.fetch();
    
    if (msg.content.toLowerCase() === '!deploy' && msg.author.id === client.application?.owner.id) {
		await client.guilds.cache.get('638935273694035990')?.commands.set(config.commands);
        console.log("Commands Deployed!");
	}
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    switch (interaction.commandName) {
        case 'help':
            // TODO: help
            break;
        case 'check-requirements':
            await checkreqs(interaction);
            break;
    }
});

client.login(process.env.TOKEN);