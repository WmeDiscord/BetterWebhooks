const discord = require('discord.js');
const MAX_MESSAGE_LENGTH = 40;

module.exports.send = (id, token, repo, branch, url, commits, size, pfp, repoShort, sender, repoObj, repoStats) => new Promise((resolve, reject) => {
    var client;
    console.log("Preparing Webhook...");
    try {
        client = new discord.WebhookClient(id, token);
    }
    catch (error) {
        reject(error.message);
        return;
    }
    embed = createEmbed(repo, branch, url, commits, size, sender, repoObj, repoStats)
    client.send({
        username: repoShort,
        avatarURL: pfp,
        embeds: [embed]

    }).then(() => {
        console.log("Successfully sent the message!");
        resolve();
    }, reject);
});

function createEmbed(repo, branch, url, commits, size, sender, repoObj, repoStats) {
    console.log("Constructing Embed...");
    var latest = commits[0];

    var embed = new discord.RichEmbed()
                .setColor(0x00BB22)
                .setURL(url)
                .setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + repo + " (" + branch + ")")
                .setDescription(getChangeLog(commits, size, repoObj, repoStats))
                .setTimestamp(Date.parse(latest.timestamp))
                .setAuthor("| Github","https://github.githubassets.com/favicons/favicon-dark.png")
                .setFooter(`Commit made by ${sender.login}`, sender.avatar_url.split('?')[0] + "?_=" + Math.random())
    console.log(JSON.stringify(embed))
    return embed;
}

function getChangeLog(commits, size, repoObj, repoStats) {
    var changelog = "";

    for (var i in commits) {
        if (i > 3) {
            changelog += `+ ${size - i} more...\n`;
            break;
        }

        var commit = commits[i];
        var sha = commit.id.substring(0, 6);
        var message = commit.message.length > MAX_MESSAGE_LENGTH ? (commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."): commit.message;
        changelog += `[\`${sha}\`](${commit.url}) ${message.split('\n\n')[0]}  -  [\`${commit.author.name}\`](https://github.com/${commit.author.username})\n`;
    }
    if (repoStats) {
        changelog += `\n<:issueopened:921844108413243442> ${repoObj.open_issues}`
        if (repoObj.allow_forking) changelog += ` - <:ghfork:1012108458402779237> ${repoObj.forks}`
        changelog += ` - <:ghstars:1012118387452821664> ${repoObj.stargazers}`
    }
    return changelog;
}
