# reservation-check

Check periodically for canceled slots in a reservation system.

## The problem

Some professionals like doctors, consultants and others have very busy schedule.  
Having the first available reservation months from now. So your only choice is to book several months from now.

## The solution

This app uses an [express.js](https://expressjs.com/) server, [puppeteer](https://pptr.dev/) and [nodemailer](https://www.nodemailer.com/) to periodically check the reservation calender for available slots, possibly canceled reservations. The check is ran four times a day by default, can be customized via `CRON_SCHEDULE` env var.
If a free slot is found in the reservation calendar an email notification is sent about the specific date. So you can possibly rebook your reservation for an earlier date.

## Note

Created for a specific use case, so UI selectors and logic might not be generic. Possibly needs and update for a different use case. Check [.env.example](.env.example) for settings.

## Deployment

Can also be used locally, however the recommended use is to deploy as a docker container on a VPS.
