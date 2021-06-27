# Walmart coupon verifier

This software verifies Walmart Argentina coupons applied to a cart. There are already some known promo codes to have worked several times in the past that might get active again from time to time. Whenever a coupon is confirmed to be active, a notification is sent to a Telegram group.

## Installation

Just `npm install`

## Tasks

| Name                           | Description                                             |
|--------------------------------|---------------------------------------------------------|
| `npm run start`                | run application (additional env variables needed)       |
| `npm run walmart`              | run walmart only with mock notifications                |

## Tokens

```bash
export WALMART_CART_ID=<cart_id>
export TELEGRAM_BOT_TOKEN=<telegram_bot_access_key>
export TELEGRAM_CHANNEL=<telegram_channel>
```

## Deployment

When pushed, a Github Action runs and pushes the code to Heroku using Docker

## TODO list

- [ ] Auto create a cart in Walmart, as it currently depends on a cart id which is in the code, it would be awesome that it is autocreated based on some random products and the cart value is above some defined value.
- [ ] Mock with proxyquire
- [ ] Read the cart from DB for walmart
- [ ] Provide a UI to change options (like to change the walmart cart through the UI)
