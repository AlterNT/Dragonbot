# DragonBot

A discord bot featuring Hypixel Skyblock utility commands, primarily for the management of the guild Dungeons N Dragons.

## Environment Variables

These are the variables required for the bot to run.

    TOKEN=<Discord Bot Token>

## Commands

### Check Requirements

    /check-requirements <Username> <Requirements>

- Username: The player's username.
- Requirements: A comma-separated list of requirements. E.g. '`SA40, Combat 50, rev8, Mining 500000xp`'.

#### Output

![Example Image](https://cdn.discordapp.com/attachments/670149716755087390/863703145498279956/unknown.png)

#### Notes

A full table of all requirements and their aliases can be found [here](#requirements).

    More commands to come soon!

## Requirements

### Regular Skills + Aliases

Full Name | Aliases
-|-
Farming|farm, far
Mining|mini, min
Combat|comb, com
Foraging|fora, for
Fishing|fish, fis
Enchanting|ench, enc
Alchemy|alch, alc
Taming|tami, tam
Carpentry|carp, car
Runecrafting|runecraft, rune, run
Catacombs|cata, cat
Healer|heal
Mage |
Berserker|berserk, bers, ber
Archer|arch
Tank|
Revenant Horror|zombieslayer, revenant, reve, rev
Tarantula Broodfather|spiderslayer, tarantula, tara, tar
Sven Packmaster|wolfslayer, svenslayer, sven
Voidgloom Seraph|endermanslayer, emanslayer, enderslayer, voidgloom, void, eman

#### Format

These can all be expressed in the form of `<Name><Number><XP>`. Not case-sensitive.
- Name: Any full name or alias described in the table.
- Number: The level/experience to check for.
- XP - Optional: If 'xp' is present it will check for experience, rather than level.

### Special Requirements

Full Name | Aliases
-|-
Skill Average|sa
MaxClass|class, clas
Slayers|slayer, slay

#### Skill Average

Allows to set the requirement of a skill average.

This is expressed in the form of `<Name><Number>`. Not case-sensitive.
- Name: Any full name or alias described in the table.
- Number: The skill average to check for.

#### Max Class

Allows to set the requirement of a player's highest level dungeon class.

This is expressed in the same [format](#format) as other skills.

#### Slayers

Allows to set the requirement of all slayers at the same time.

This is expressed as `<1st Level><2nd Level><3rd Level>...` The order of the levels specified correspond to the slayer of the same position.

It can also be expressed as `<Number>xp` to set a requirement of cumulative slayer xp.

Index | Slayer
-|-
1st|Revenant Horror
2nd|Tarantula Broodfather
3rd|Sven Packmaster
4th|Voidgloom Seraph