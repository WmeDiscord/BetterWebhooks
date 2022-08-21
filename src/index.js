const core = require('@actions/core');
const github = require('@actions/github');

const webhook = require('../src/discord.js');

async function run() {
	const payload = github.context.payload;
	const pfp = payload.owner.avatar_url;
	const repository = payload.repository.full_name;
	const repository_short = payload.repository.name;
	const commits = payload.commits;
	const size = commits.length;
	const branch = payload.ref.split('/')[payload.ref.split('/').length - 1];

	console.log(`Received payload ${JSON.stringify(payload, null, 2)}`);
	console.log(`Received ${commits.length}/${size} commits...`);

	if (commits.length === 0) {
        // This was likely a "--tags" push.
        console.log(`Aborting analysis, found no commits.`);
		return;
	}

    const id = core.getInput("id");
    const token = core.getInput("token");

	webhook.send(id, token, repository, branch, payload.compare, commits, size, pfp, repository_short).catch(err => core.setFailed(err.message));
    
}

try {
	run();
} catch (error) {
    core.setFailed(error.message);
}

function isSkipped(commit) {
	return commit.message.toLowerCase().includes("[skip]");
}
