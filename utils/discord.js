const { MessageActionRow, Client, EmbedBuilder, Permissions, MessageAttachment, MessageButton } = require('discord.js');
const steamApi = require('./steamApi');
module.exports = function(playerList){
    this.client = new Client({intents: 98045});
    this.client.on('ready', async () => {
        this.client.user.setPresence({
            status: 'online',
            activities: [{ name: `over ${playerList.length} Steam users...`, type: 'WATCHING' }]
        });
        console.log('Discord Client ready.');
        this.client.application.commands.create({
            name: "list",
            description: "Manage user list from Discord",
            options: [
                {
                    name: "add",
                    type: 1,
                    description: "Add Steam account to the list",
                    options: [
                        {
                            "name": "steamid",
                            "description": "User steamID64",
                            "type": 3,
                            "required": true
                        }
                    ]
                },
                {
                    name: "remove",
                    type: 1,
                    description: "Remove Steam account from the list",
                    options: [
                        {
                            name: "steamid",
                            description: "User steamID64",
                            type: 3,
                            required: true
                        }
                    ]
                }
            ]
        }).then((commandInfo) => {
            console.log(`Registered /${commandInfo.name} (ID: ${commandInfo.id})`)
        }).catch(console.error);
    });
    this.client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        console.log(`Command /${commandName} used in #${interaction.channel.name} within ${interaction.guild.name}`);
        if (commandName === 'list'){
            const steamID = interaction.options.getString('steamid');
            if(interaction.options.getSubcommand() === 'add'){
                const userData = await steamApi.getPlayerSummary(steamID);
                const { nickname, profileUrl, avatarUrl, lastLogOff, accountCreated, country } = userData;
                const userLevel = await steamApi.getUserLevel(steamID);
                const userGames = await steamApi.getUserGames(steamID);
                const { gameCount } = userGames;
                playerList.push({ nickname, profileUrl, avatarUrl, lastLogOff, accountCreated, country });
                const embed = new EmbedBuilder()
                    .setColor('DARK_VIVID_PINK')
                    .setTitle('User added to watchlist!')
                    .setAuthor({ name: nickname, iconURL: avatarUrl, url: profileUrl })
                    .setDescription(`> **Game count:** \`${gameCount}\`\n> **Steam level:** \`${userLevel}\`\n> **Account created:** \`${accountCreated}\`\n> **Last log off:** \`${lastLogOff}\`\n> **Country code:** \`${country}\``)
                    .setTimestamp()
                    .setFooter({ text: 'SteamChecker', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
                interaction.reply({
                    embeds: [embed]
                })
            } else if(interaction.options.getSubcommand() === 'remove'){
                console.log(steamID)
            }
        }
    });
    this.client.login(process.env.DISCORD_TOKEN);
}