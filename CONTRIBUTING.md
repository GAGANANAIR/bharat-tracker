# Contributing to Bharat Tracker

Thanks for your interest in improving this project! A few ways to help:

## Adding or correcting a government scheme
Edit the `SCHEMES` array in `schemes.js`. Each entry needs:
```js
{
  name: "Scheme Name",
  category: "Category",
  who: "Who is eligible",
  benefit: "What they get",
  how: "How to apply",
  link: "Official scheme URL"
}
```
Please only add schemes you can verify against an official government source, and keep the `link` field pointing to that official page.

## Wiring up the fuel price API
The fuel price section currently accepts a `data.gov.in` API key but doesn't yet call a specific resource endpoint (data.gov.in has hundreds of datasets, and picking the right resource ID per state/city needs some digging). A PR that wires this up properly — with attribution to the specific dataset used — is very welcome.

## Adding a real free train status source
If you find a genuinely free, keyless, reliable API for Indian Railways PNR or running status, please open an issue with a link and example response before submitting a PR — the current approach deliberately avoids scraping or unreliable third-party sources.

## General
- Keep changes focused — one improvement per PR
- Test that the page still works with `open index.html` locally (no build step)
- Be upfront in your PR description about any new data source's cost/auth requirements
