require('dotenv').config();
const axios = require('axios').default;
const dayjs = require('dayjs');
module.exports = {
    getPlayerBans: async (steamID) => {
        const res = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${process.env.STEAM_API_KEY}&steamids=${steamID}`)
            .then(function (response) {
                const { CommunityBanned, VACBanned, NumberOfVACBans, DaysSinceLastBan, NumberOfGameBans } = response.data.players[0];
                return {
                    communityBanned: CommunityBanned,
                    vacBanned: VACBanned,
                    vacBans: NumberOfVACBans,
                    sinceLastBan: DaysSinceLastBan,
                    gameBans: NumberOfGameBans
                };
            })
            .catch(function (error) {
              console.log(error);
            });
        return res;
    },
    getPlayerSummary: async (steamID) => {
        const res = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamID}`)
            .then(function (response) {
                const { personaname, profileurl, avatar, lastlogoff, timecreated, loccountrycode } = response.data.response.players[0];
                return {
                    nickname: personaname,
                    profileUrl: profileurl,
                    avatarUrl: avatar,
                    lastLogOff: dayjs.unix(lastlogoff).format('DD/MM/YYYY HH:mm'),
                    accountCreated: dayjs.unix(timecreated).format('DD/MM/YYYY HH:mm'),
                    country: loccountrycode
                };
            })
            .catch(function (error) {
              console.log(error);
            });
        return res;
    },
    getUserLevel: async (steamID) => {
        const res = await axios.get(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamID}`)
        .then((response) => {
            return response.data.response.player_level;
        }).catch((err) => {
            return err;
        })
        return res;
    },
    getUserGames: async (steamID) => {
        const res = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamID}`)
        .then((response) => {
            return {
                gameCount: response.data.response.game_count,
                games: response.data.response.games
            }
        }).catch((err) => {
            return err;
        })
        return res;
    }
}