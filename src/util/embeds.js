import { MessageEmbed } from "discord.js";

export function errorEmbed(error) {
    return new MessageEmbed()
        .setColor('#FF0000')
        .setThumbnail('https://cdn.discordapp.com/attachments/863514657398063125/863514739119882240/robodragon.png')
        .setTitle('Error')
        .setDescription(error);
}

export function successEmbed(message) {
    return new MessageEmbed()
        .setColor('#00FF00')
        .setThumbnail('https://cdn.discordapp.com/attachments/863514657398063125/863514739119882240/robodragon.png')
        .setTitle('Success')
        .setDescription(message)
}

export function bridgeEmbed(name, message, mcId, color) {
    return new MessageEmbed()
        .setColor(color)
        .setDescription('**' +  name + ' > **' + message)
        .setThumbnail('https://crafatar.com/avatars/' + mcId + '?overlay&size=16');
}