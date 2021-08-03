import { dragonBot } from '../index.js';
import { promises } from 'fs';
import config from './config.js';
import { fetch } from './util.js';

export class Cache {

    static discordLinked;
    static members;
    static profiles;

    constructor(data) {
        this.discordLinked = new Map(data.linked);
        this.members = new Map(data.members.map(([mcId, obj]) => [mcId, Member.from(obj)]));
        this.profiles = new Map(data.profiles.map(([profileId, obj]) => [profileId, Profile.from(obj)]));
    }

    async getPlayer(mcId) {
        if (!this.members.has(mcId)) {
            this.members.set(mcId, await Member.create(mcId));
        }
        return this.members.get(mcId);
    }

    async getProfile(profileId) {
        if (!this.profiles.has(profileId)) {
            this.profiles.set(profileId, await Profile.create(profileId));
        }
        return this.profiles.get(profileId);
    }

    async write() {
        await promises.writeFile(config.cacheLocation, JSON.stringify({
            linked: Array.from(this.discordLinked.entries()),
            members: Array.from(this.members.entries()),
            profiles: Array.from(this.profiles.entries()),
        }), 'utf-8');
    }
}

class Member {
    static async create(mcId) {
        let member = new Member();
        await member.update(mcId);
        return member;
    }

    async update(mcId) {
        this.mcId = mcId;
        this.member = (await fetch(config.hypixelApi.address, 'player', { key: config.hypixelApi.key, uuid: mcId })).player;
        if (this.member?.socialMedia?.links?.DISCORD !== null) {
            dragonBot.cache.discordLinked.set(this.member.socialMedia.links.DISCORD, mcId);
        }
        this.member.guildRank = (await fetch(config.hypixelApi.address, 'guild', { key: config.hypixelApi.key, player: mcId }))?.guild.members.find(p => p.uuid === mcId).rank;
        for (const profileId of Object.keys(this.member.stats.SkyBlock.profiles)) {
            if (!dragonBot.cache.profiles.has(profileId)) {
                dragonBot.cache.profiles.set(profileId, new Profile(profileId));
            }
        }
        this.lastUpdated = Date.now();
        dragonBot.cache.write();
    }

    async get(timeframe = Number.MAX_VALUE) {
        if (Date.now() - this.lastUpdated > timeframe) {
            await this.update(this.mcId);
        }
        return this.member;
    }

    static from(obj) {
        return Object.assign(new Member(), obj);
    }
}

class Profile {
    static async create(profileId) {
        let profile = new Profile();
        await profile.update(profileId);
        return profile;
    }

    async update(profileId) {
        this.profileId = profileId;
        this.profile = (await fetch(config.hypixelApi.address, 'skyblock/profile', { key: config.hypixelApi.key, profile: profileId })).profile;
        this.lastUpdated = Date.now();
        dragonBot.cache.write();
    }

    async get(timeframe = Number.MAX_VALUE) {
        if (Date.now() - this.lastUpdated > timeframe) {
            await this.update(this.profileId);
        }
        return this.profile;
    }
    static from(obj) {
        return Object.assign(new Profile(), obj);
    }
}
