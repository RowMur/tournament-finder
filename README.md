# Table Tennis Tournament Finder

A Node.js project for finding table tennis tournaments. I've started playing tournaments in the last few months and have found it rather painful to find them, have missed entry deadlines, etc. My ambition for this project is to have a newsletter of sorts that will send me a list of tournaments with upcoming entry deadlines, ones that are close to me, or some other helpful category.

## Development

**Prerequisites**

This app uses the Sendgrid API for sending emails as well as the Google maps API. Add the following to your `.env` file...

```
EMAIL_API_KEY=<sendgrid-api-key>
EMAIL=<email>
MAPS_KEY=<Google maps API key>
HOME_POST_CODE=<Home post code>
```

### Main App

I use [NVM](https://github.com/nvm-sh/nvm) to handle my Node version. You can find my version of node in `.nvmrc`. Make sure you have a similar version installed, or if you also use NVM. Run the following command...

```
nvm use <node version>
```

Next, you'll need to install the project's dependencies...

```
npm ci
```

The main entry point for this project is the `main.js` file. You can run this project with the following...

```
npm run start
```

You can also run the project's tests with the following...

```
npm run test
```

### GitHub Actions

I'm using [Act](https://github.com/nektos/act) to develop the GitHub actions. To mock a trigger, run the following...

```
act <trigger> --secret-file .env
```
