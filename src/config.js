export default {
    prefix: '&',
    guildUUID: '5d90edb577ce8436b66ad1d2',

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
            description: 'Checks if the specified member meets the specified reqirements.',
            options: [
                {
                    name: 'name',
                    type: 'STRING',
                    description: 'The IGN of the member.',
                    required: true,
                }, 
                {
                    name: 'requirements',
                    type: 'STRING',
                    description: 'A comma-separated list of requirements. Ex: \'SA40, Combat 50, rev8, Mining 500000xp\'.',
                    required: true,
                },
            ],
        },
    ]
};