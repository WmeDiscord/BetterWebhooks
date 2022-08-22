# BetterWebhooks
This GitHub Action can produce fancy and more meaningful discord messages for your commits.

## :mailbox_with_no_mail: Inputs

### `id`
**Required** This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it.

### `token`
**Required** Now your Discord webhook token, it's the second part of the url.

## :scroll: Example setup
To set up this Action, create a new workflow file under `.github/workflows/workflow_name.yml`.   
You should configure the webhook id in advance.

```yaml
name: Discord Webhook
on: [push]

jobs:
  DiscordWebhook:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2.3.4
      
    - name: Run Discord Webhook
      uses: WmeDiscord/BetterWebhooks@main
      with:
        id: ${{ secrets.YOUR_DISCORD_WEBHOOK_ID }}
        token: ${{ secrets.YOUR_DISCORD_WEBHOOK_TOKEN }}
```
