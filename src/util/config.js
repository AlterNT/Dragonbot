export default {
    guild: {
        id: '5d90edb577ce8436b66ad1d2',
        requirements: 'slay 750000xp, cata 25, sa 35'
    },

    bridge: {
        mcTimeout: 3600000,
        channel: '864813613067534366',
        log: '864806106446823445',
    },

    cacheLocation: './cache.json',

    mojangApi: {
        address: 'https://api.mojang.com/'
    },

    hypixelApi: {
        address: 'https://api.hypixel.net/',
        key: '9c740f5f-0faa-4912-9077-68f26acd38ad'
    },

    commands: [
        {
            name: 'help',
            description: 'More info on each command.',
        },
        {
            name: 'check-requirements',
            description: 'Checks if the specified player meets the specified reqirements.',
            options: [
                {
                    name: 'name',
                    type: 'STRING',
                    description: 'The IGN of the player.',
                    required: true,
                }, 
                {
                    name: 'requirements',
                    type: 'STRING',
                    description: 'A comma-separated list of requirements. E.g. \'SA40, Combat 50, rev8, Mining 500000xp\'.',
                    required: true,
                },
            ],
        },
        {
            name: 'guild-requirements',
            description: 'Checks if the specified player meets guild requirements.',
            options: [
                {
                    name: 'name',
                    type: 'STRING',
                    description: 'The IGN of the player.',
                    required: true,
                },
            ],
        },
        {
            name: 'verify',
            description: 'Verifies your ingame account matches your discord account.',
            options: [
                {
                    name: 'name',
                    type: 'STRING',
                    description: 'Your IGN.',
                    required: true,
                },
            ],
        },
    ],
};