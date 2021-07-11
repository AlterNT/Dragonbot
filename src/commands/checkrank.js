import { fetch, getLatestProfile, sleep } from '../util.js';
import config from '../config.js';

export default async (msg, command) => {
    let progress = await msg.channel.send('Processing...');

    let guild = (await fetch(config.hypixelApi.address, 'guild', { key: config.hypixelApi.key, id: config.guildUUID })).guild;

    let ranks = guild.ranks;

    let priority = ranks.find(r => r.name == command[1]).priority;

    let searchMembersUUID = guild.members.filter(m => ranks.find(r => r.name == m.rank)?.priority <= priority).map(m => m.uuid);

    let memberNames = [];
    await (async () => {
        for (const uuid of searchMembersUUID) {
            let nameresult = await fetch(config.mojangApi.address, 'user/profiles/' + uuid + '/names');
            memberNames.push(nameresult[nameresult.length - 1].name);
        }
    })();

    let memberProfiles = [];
    await (async () => {
        for (const [ i, uuid ] of searchMembersUUID.entries()) {
            memberProfiles.push(await getLatestProfile(uuid));
            progress.edit('Processing (' + Math.round((i / searchMembersUUID.length) * 100) + '%): ' + memberNames[searchMembersUUID.findIndex(u => u == uuid)]);
            await sleep(5000);
        }
    })();
    progress.edit('Done!');

    for (let i = 0; i < searchMembersUUID.length; i++) {
        const name = memberNames[i];
        const profile = memberProfiles[i];
        msg.channel.send(name + ' has ' + (profile?.fairy_souls_collected ?? 'null') + ' fairy souls.\n');
    }
};