import config from "../config.js"
import checkreqs from "./checkreqs.js";

export default async (interaction) => {
    interaction.options.set('requirements', { value: config.guild.requirements });
    await checkreqs(interaction);
}