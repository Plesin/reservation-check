# reservation-check

Check periodically for canceled slots in reservation systems

## The problem

Some professionals like doctors, consultants and other have very busy schedule.  
Having the first available reservation months from now. So your only choice is to book let's say in three months time.

## The solution

This app uses an [express.js](https://expressjs.com/) server, [puppeteer](https://pptr.dev/) and [nodemailer](https://www.nodemailer.com/) to periodically check the reservation calender for available slots, possibly canceled reservations. So you can possibly rebook your reservation for an earlier date.

## Note

Created for a specific use case, so UI selectors and logic might not be generic. Possibly needs and update for a different use case. Check [.env.example](.env.example) for settings.

## Deployment

Can also be used locally, however the recommended use is to deploy as a docker container via [coolify](https://coolify.io/).
