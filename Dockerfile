FROM node:12

COPY . ./walmart-coupon-verifier/

WORKDIR /walmart-coupon-verifier/

RUN npm install

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG TELEGRAM_BOT_TOKEN
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN

ARG TELEGRAM_CHANNEL
ENV TELEGRAM_CHANNEL=$TELEGRAM_CHANNEL

ARG WALMART_CART_ID
ENV WALMART_CART_ID=$WALMART_CART_ID

CMD npm run start:deploy
