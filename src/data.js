import { getProperty } from "./util.js";

const SKILL_XP_SCALING = [
    50,
    175,
    375,
    675,
    1175,
    1925,
    2925,
    4425,
    6425,
    9925,
    14925,
    22425,
    32425,
    47425,
    67425,
    97425,
    147425,
    222425,
    322425,
    522425,
    822425,
    1222425,
    1722425,
    2322425,
    3022425,
    3822425,
    4722425,
    5722425,
    6822425,
    8022425,
    9322425,
    10722425,
    12222425,
    13822425,
    15522425,
    17322425,
    19222425,
    21222425,
    23322425,
    25522425,
    27822425,
    30222425,
    32722425,
    35322425,
    38072425,
    40972425,
    44072425,
    47472425,
    51172425,
    55172425,
    59472425,
    64072425,
    68972425,
    74172425,
    79672425,
    85472425,
    91572425,
    97972425,
    104672425,
    111672425,
];

const DUNGEON_XP_SCALING = [
    50,
    125,
    235,
    395,
    625,
    955,
    1425,
    2095,
    3045,
    4385,
    6275,
    8940,
    12700,
    17960,
    25340,
    35640,
    50040,
    70040,
    97640,
    135640,
    188140,
    259640,
    356640,
    488640,
    668640,
    911640,
    1239640,
    1684640,
    2284640,
    3084640,
    4149640,
    5559640,
    7459640,
    9959640,
    13259640,
    17559640,
    23159640,
    30359640,
    39559640,
    51559640,
    66559640,
    85559640,
    109559640,
    139559640,
    177559640,
    225559640,
    285559640,
    360559640,
    453559640,
    569809640,
];

const RUNECRAFTING_XP_SCALING = [
    50,
    150,
    275,
    435,
    635,
    885,
    1200,
    1600,
    2100,
    2725,
    3510,
    4510,
    5760,
    7325,
    9325,
    11825,
    14950,
    18950,
    23950,
    30200,
    38050,
    47850,
    60100,
    75400,
];

const CARPENTRY_XP_SCALING = [];

export const TYPE = {
    SKILL: 0,
    DUNGEON: 1,
    CLASS: 2,
    SLAYER: 3
};

export const SKILLS = {
    farming: {
        name: 'Farming',
        aliases: ['farm', 'far'],
        maxLevel: 60,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_farming',
        inSkillAverage: true,
        capacity: (profile) => 50 + (getProperty(profile, 'jacob2.unique_golds2.length') ?? 0),
    },
    mining: {
        name: 'Mining',
        aliases: ['mini', 'min'],
        maxLevel: 60,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_mining',
        inSkillAverage: true,
    },
    combat: {
        name: 'Combat',
        aliases: ['comb', 'com'],
        maxLevel: 60,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_combat',
        inSkillAverage: true,
    },
    foraging: {
        name: 'Foraging',
        aliases: ['fora', 'for'],
        maxLevel: 50,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_foraging',
        inSkillAverage: true,
    },
    fishing: {
        name: 'Fishing',
        aliases: ['fish', 'fis'],
        maxLevel: 50,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_fishing',
        inSkillAverage: true,
    },
    enchanting: {
        name: 'Enchanting',
        aliases: ['ench', 'enc'],
        maxLevel: 60,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_enchanting',
        inSkillAverage: true,
    },
    alchemy: {
        name: 'Alchemy',
        aliases: ['alch', 'alc'],
        maxLevel: 50,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_alchemy',
        inSkillAverage: true,
    },
    taming: {
        name: 'Taming',
        aliases: ['tami', 'tam'],
        maxLevel: 50,
        scaling: SKILL_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_taming',
        inSkillAverage: true,
    },
    carpentry: {
        name: 'Carpentry',
        aliases: ['carp', 'car'],
        maxLevel: 50,
        scaling: CARPENTRY_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_carpentry',
        inSkillAverage: false,
    },
    runecrafting: {
        name: 'Runecrafting',
        aliases: ['runecraft', 'rune', 'run'],
        maxLevel: 25,
        scaling: RUNECRAFTING_XP_SCALING,
        type: TYPE.SKILL,
        xpPath: 'experience_skill_runecrafting',
        inSkillAverage: false,
    },
    catacombs: {
        name: 'Catacombs',
        aliases: ['cata', 'cat'],
        maxLevel: 50,
        scaling: DUNGEON_XP_SCALING,
        type: TYPE.DUNGEON,
        xpPath: 'dungeons.dungeon_types.catacombs.experience',
        inSkillAverage: false,
    },
    healer: {
        name: 'Healer',
        aliases: ['heal'],
        maxLevel: 50,
        scaling: DUNGEON_XP_SCALING,
        type: TYPE.CLASS,
        xpPath: 'dungeons.player_classes.healer.experience',
        inSkillAverage: false,
    },
    mage: {
        name: 'Mage',
        aliases: [],
        maxLevel: 50,
        scaling: DUNGEON_XP_SCALING,
        type: TYPE.CLASS,
        xpPath: 'dungeons.player_classes.mage.experience',
        inSkillAverage: false,
    },
    berserker: {
        name: 'Berserker',
        aliases: ['berserk', 'bers', 'ber'],
        maxLevel: 50,
        scaling: DUNGEON_XP_SCALING,
        type: TYPE.CLASS,
        xpPath: 'dungeons.player_classes.berserk.experience',
        inSkillAverage: false,
    },
    archer: {
        name: 'Archer',
        aliases: ['arch'],
        maxLevel: 50,
        scaling: DUNGEON_XP_SCALING,
        type: TYPE.CLASS,
        xpPath: 'dungeons.player_classes.archer.experience',
        inSkillAverage: false,
    },
    tank: {
        name: 'Tank',
        aliases: [],
        maxLevel: 50,
        scaling: DUNGEON_XP_SCALING,
        type: TYPE.CLASS,
        xpPath: 'dungeons.player_classes.tank.experience',
        inSkillAverage: false,
    },
    revenant_horror: {
        name: 'Revenant Horror',
        aliases: ['revenanthorror', 'zombieslayer', 'revenant', 'reve', 'rev'],
        maxLevel: 9,
        scaling: [
            0,
            5,
            15,
            200,
            1000,
            5000,
            20000,
            100000,
            400000,
            1000000,
        ],
        type: TYPE.SLAYER,
        position: 0,
        xpPath: 'slayer_bosses.zombie.xp',
        inSkillAverage: false,
    },
    tarantula_broodfather: {
        name: 'Tarantula Broodfather',
        aliases: ['tarantulabroodfather', 'spiderslayer', 'tarantula', 'tara', 'tar'],
        maxLevel: 9,
        scaling: [
            0,
            5,
            25,
            200,
            1000,
            5000,
            20000,
            100000,
            400000,
            1000000,
        ],
        type: TYPE.SLAYER,
        position: 1,
        xpPath: 'slayer_bosses.spider.xp',
        inSkillAverage: false,
    },
    sven_packmaster: {
        name: 'Sven Packmaster',
        aliases: ['svenpackmaster', 'wolfslayer', 'svenslayer', 'sven'],
        maxLevel: 9,
        scaling: [
            0,
            10,
            30,
            250,
            1500,
            5000,
            20000,
            100000,
            400000,
            1000000,
        ],
        type: TYPE.SLAYER,
        position: 2,
        xpPath: 'slayer_bosses.wolf.xp',
        inSkillAverage: false,
    },
    voidgloom_seraph: {
        name: 'Voidgloom Seraph',
        aliases: ['voidgloomseraph', 'endermanslayer', 'emanslayer', 'enderslayer', 'voidgloom', 'void', 'eman'],
        maxLevel: 9,
        scaling: [
            0,
            10,
            30,
            250,
            1500,
            5000,
            20000,
            100000,
            400000,
            1000000,
        ],
        position: 3,
        type: TYPE.SLAYER,
        xpPath: 'slayer_bosses.enderman.xp',
        inSkillAverage: false,
    }
}