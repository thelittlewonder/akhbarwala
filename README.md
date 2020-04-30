# Akbarwala 🗞
Whatsapp Bot to send newspaper every morning

## Setting up
To set up your own version of this Whatsapp bot
- Create an account on Twilio and obtain the auth token and account SSID.
- Set up the Whatsapp sandbox on Twilio. ([Docs here](https://www.twilio.com/docs/whatsapp/api#twilio-sandbox-for-whatsapp))
- Deploy this node project to service of your choice. I prefer `repl.it`
- Create `.env` file with the following:

```

TWILIO_ACCOUNT_SID = Your account SSID (obtained from Twilio)

TWILIO_AUTH_TOKEN = Twilio Authorisation Token (obtained from Twilio)

SANDBOX_NUMBER = The number which sends you the whatsapp message (obtained from Twilio)

API_URL = The base url where this node project is hosted (eg. akbharwala.herokuapp.com)

```
- Now you can send the newspaper by the `/send` route by appending the phone number like this `akbharwala.herokuapp.com?ph=+xxxxxxxxxxx`.

_Make sure the phone number to which you are sending the newspaper is in the sandbox._
