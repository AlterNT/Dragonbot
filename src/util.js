import gotpkg from 'got';
const { get } = gotpkg;
import { SKILLS, TYPE } from './data.js';

export async function sleep(ms) {
    await new Promise(res => {
        setTimeout(() => {
            res(0);
        }, ms);
    });
};

export async function fetch(api, request, params = {}) {
    let query = '?' + Object.entries(params).map(p => p.join('=')).join('&');
    try {
        return (await get(api + request + query, { responseType: 'json' })).body;
    } catch (error) {
        console.error(error.response.body);
    }
};

export function getLatestProfile(profiles, uuid) {
    return profiles?.find(p => p.members[uuid].last_save === Math.max(...profiles.map(p => p.members[uuid].last_save)));
};

export function parseReqs(reqs, profile) {
    let pairs = reqs.toLowerCase().replace(/ /g, '').split(',').map(s => s.match(/[^0-9]+|[0-9]+/gi)).filter(p => p != null);
    let result = [];
    for (const req of pairs) {
        let search = searchAlias(SKILLS, req[0]);
        if (req.join('').length > 64) {
            result.push({
                pass: false,
                requirement: null,
                value: null,
                name: 'Input was too long',
                unit: req.join('').slice(0,64) + '...',
            });
        } else if (Object.keys(search).length === 1) {
            let skill = Object.values(search)[0];
            let xp = getProperty(profile, skill.xpPath);
            if (req[2] === 'xp') {
                result.push({
                    pass: xp >= req[1],
                    requirement: req[1],
                    value: xp,
                    name: skill.name,
                    unit: 'XP',
                });
            } else {
                result.push({
                    pass: getLevelFromXp(xp, skill, skill.capacity?.(profile)) >= req[1],
                    requirement: req[1],
                    value: getLevelFromXp(xp, skill, skill.capacity?.(profile)),
                    name: skill.name,
                    unit: 'Levels',
                });
            }
        } else if (Object.keys(search).length === 0) {
            if (['skillaverage', 'sa'].includes(req[0])) {
                let contributingSkills = Object.values(SKILLS).reduce((total, skill) => total + skill.inSkillAverage, 0);
                let skillAverage = Object.values(SKILLS).filter(skill => skill.inSkillAverage).reduce((acc, skill) => {
                    return acc + (getLevelFromXp(getProperty(profile, skill.xpPath), skill, skill.capacity?.(profile)) / contributingSkills);
                }, 0);
                result.push({
                    pass: skillAverage >= req[1],
                    requirement: req[1],
                    value: skillAverage,
                    name: 'Skill Average',
                    unit: '',
                });
            } else if (['maxclass', 'class', 'clas'].includes(req[0])) {
                let maxClassSkill = Object.values(SKILLS).reduce( (acc, skill) => {
                    if (skill.type === TYPE.CLASS) {
                        if (acc === null) {
                            return skill;
                        } else if (getProperty(profile, skill.xpPath) > getProperty(profile, acc.xpPath)) {
                            return skill;
                        } else {
                            return acc;
                        }
                    }
                });
                let xp = getProperty(profile, maxClassSkill.xpPath);
                if (req[2] === 'xp') {
                    result.push({
                        pass: xp >= req[1],
                        requirement: req[1],
                        value: xp,
                        name: 'Highest Class XP (' + maxClassSkill.name + ')',
                        unit: 'XP',
                    });
                } else {
                    result.push({
                        pass: getLevelFromXp(xp, maxClassSkill, maxClassSkill.capacity?.(profile)) >= req[1],
                        requirement: req[1],
                        value: getLevelFromXp(xp, maxClassSkill, maxClassSkill.capacity?.(profile)),
                        name: 'Highest Class Level (' + maxClassSkill.name + ')',
                        unit: 'Levels',
                    });
                }
            } else if (['slayers', 'slayer', 'slay'].includes(req[0])) {
                let value = '';
                let pass = [...req[1]].every((v, i) => {
                    let skill = Object.values(SKILLS).find(skill => skill.type === TYPE.SLAYER && skill?.position === i);
                    let level = getLevelFromXp(getProperty(profile, skill.xpPath), skill, skill.capacity?.(profile));
                    value += level;
                    return v >= level;
                });
                result.push({
                    pass: pass,
                    requirement: req[1],
                    value: value,
                    name: 'Slayer Levels',
                    unit: '',
                });
            } else {
                result.push({
                    pass: false,
                    requirement: '',
                    value: '',
                    name: 'Unable to parse',
                    unit: req[0],
                });
            }
        }
    }
    return result;
};

export function getLevelFromXp(xp = 0, skill, capacity = null) {
    if (xp < skill.scaling[0]) {
        return 0;
    }
    let max = skill.maxLevel;
    let min = 0;
    let pivot;
    while (max != min + 1) {
        pivot = Math.floor((max + min) / 2);
        if (xp < skill.scaling[pivot]) {
            max = pivot;
        } else {
            min = pivot;
        }
    }
    return Math.min(min + 1, skill.maxLevel, capacity ?? Number.MAX_VALUE);
};

export function searchAlias(map, query) {
    let result = {};
    for (let [key, val] of Object.entries(map)) {
        if (key === query || val.aliases.includes(query)) {
            result[key] = val;
        }
    }
    return result;
};

export function getProperty(object, path) {
    return path?.split('.').reduce((acc, part) => {
        if (acc !== part) {
            return acc?.[part];
        } else {
            return acc;
        }
    }, object);
}