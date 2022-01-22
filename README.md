# BearWallet App

Personal finance app for managing small and big expenses.
It is based on the Notion API, and mapping the following template:

https://www.notion.so/lesbass/Bear-Wallet-5db7d7802f4a4f29a66ac24c755dee0b

<img src="https://i.imgur.com/RARzHxR.jpeg" />

## Features
The main features are:
- quickly add new expenses
- show the latest items 
- export in XLSX format the expenses based on a date selection
- project grouping
- stats on month, project and total

## Telegram Bot
There is a Telegram Bot backend available at the following link:

https://github.com/lesbass/wallet-telegrambot

It interacts with this app via a set of public APIs, authenticated via a `Bearer` token and the Telegram username (managed via the Users database in Notion).

## Setup
The quickest way to deploy the app is via Netlify.
You need to set the following Enviroment Variables:
- `NOTION_KEY`: api key from Notion
- `NOTION_WALLET_ID`: the id of the base template page (the app will find the children database by itself)
- `SECRET_COOKIE_PASSWORD`: a password for the session cookie
- `SECRET_COOKIE_NAME`: the name of the sssion cookie
- `SECRET_COOKIE_EXPIRES_DAYS`: the number of days the session cookie will be valid
- `TELEGRAM_API_KEY`: a password for the authentication with the Telegram Bot