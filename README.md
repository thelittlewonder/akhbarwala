# Akbarwala 🗞
![preview](https://i.imgur.com/iNqnDVK.png)

## Setting up
To set up your own version of this Whatsapp bot
- Create an account on Twilio and obtain the auth token and account SSID.
- Set up the Whatsapp sandbox on Twilio. ([Docs here](https://www.twilio.com/docs/whatsapp/api#twilio-sandbox-for-whatsapp))
- Deploy this node project to service of your choice. I prefer `repl.it`
- Create `.env` file with the following:

```

TWILIO_ACCOUNT_SID = Your account SSID (obtained from Twilio)

TWILIO_AUTH_TOKEN = Twilio Authorisation Token (obtained from Twilio)

SANDBOX_NUMBER = The twilio number with which you interact (obtained from Twilio)

API_URL = The base url where this node project is hosted (eg. akbharwala.herokuapp.com)

```
- You can now send "Paper" to the Twilio number to receive the newspaper. This logic is handled by the `/incoming` route.

- You can also send the newspaper by the `/send` route by appending the phone number like this `akbharwala.herokuapp.com?ph=+xxxxxxxxxxx`. It is possible to send it to multiple authorised phone numbers at once by separating them with commas.

_Make sure the phone number to which you are sending the newspaper is in the sandbox._

- To update the paper, you can run a cron job on `/update` which fetches the paper once a day

## Limitation of Twilio Whatsapp Sandbox API
I tried to automate the process by sending the paper automatically every morning but there's a limitation on the API which doesn't allow you send messages after the 24 hour window.

From [Twilio's Docs](https://www.twilio.com/docs/whatsapp/api#templates-pre-registered-for-the-sandbox):
> A WhatsApp session begins when a user sends a message to your app. Sessions are valid for 24 hours after the most recently received message, during which you can communicate with customers using free-form messages. To send a message outside the 24-hour session window, you must use a pre-approved message template.


