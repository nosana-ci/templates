# Squads Template

This template is for use with Squads, allowing you to do Multi Signature deployments for your Solana programs.
The pipeline will build your Solana program, run your tests, and deploy it to a buffer, it will then be ready for you on your Squads account to sign the deployment transaction.

This template uses an image created and maintained by Nosana, namely [`nosana/solana`](https://hub.docker.com/r/nosana/solana).
It includes tools to help with Solana development and delivery.

In this README, we will go through the steps needed to:

- Deploy a [Solana Hello World Program](https://github.com/solana-labs/example-helloworld).
- Set up a [Squads](https://squads.so/) account and hook in your deployed Solana program.
- Set up your pipeline on Nosana to help with the testing and delivery of your Solana program.

## Requirements

We will outline two options here, and we recommend the Docker option.
Do note that we will be doing this on [Solana Devnet](https://docs.solana.com/clusters#devnet).
This allows you to experiment and play around with the pipeline before putting it into production.

## Docker

Spin up an interactive Docker container. Nosana has an image that you can use that includes all the dependencies you need to build, test, and deploy your Solana program.
You can then continue with the [Deploy the Initial Solana Program](#deploy-the-initial-solana-program) section of this README.

```bash
docker run -it nosana/solana
```

## Standard

If you do not have Docker or do not want to use Docker, you will need to install the following dependencies to your system:

- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)
- [Rust](https://www.rust-lang.org/tools/install)
- [NodeJS](https://nodejs.org)
- [Compatible Solana Wallet for Squads](https://v3.squads.so/connect-squad)

## Deploy the Initial Solana Program

<a href="https://asciinema.org/a/14?autoplay=1"><img src="https://asciinema.org/a/14.png" width="836"/></a>

We will need to start by building and deploying an initial version of the smart contract to get started.
Clone the repo, `cd` into it, install the dependencies and build and deploy it.

```bash
git clone git@github.com:nosana-ci/example-helloworld.git
cd example-helloworld

npm ci
npm run build:program-c
# OR
npm run build:program-rust

solana-keygen new # Keep track of this key and import it to your wallet.

solana airdrop 1 --url devnet

solana program deploy dist/program/helloworld.so --url devnet
# => Program Id: <YourProgramId>
```

Keep track of this `ProgramID`; we will need it in a bit.

## Squads.so

[Squads.so](https://squads.so) simplifies the management of developer and treasury assets for teams building on Solana and SVM.
This allows you to create a team on Squads, import your Solana program, and ensure that any time you want to deploy an update, everyone will need to sign it.

### Requirements (optional)

Depending on your setup, you might need to import the key you used to deploy your Solana program into your wallet.
You should be able to find this file in: `$HOME/.config/solana/id.json`.
Copy the contents of this file into your wallet's import key interface.

### Setup

1. Head over to [v3.squads.so](https://v3.squads.so/connect-squad)
2. Connect your wallet using the Solana account you used to deploy your Solana program
3. Click the `Create Squad` button and fill in the details.
4. Add any other members that you want to be the initial multisig owners
5. Review and confirm the creation of your squad
6. After confirming, go to the `Programs` link in the sidebar
7. Click the `+ Add program` button
8. Add the name and `<YourProgramId>`
9. You will be presented with a dialogue to upgrade the security, click the `initiate transaction` and sign the transaction
10. Afterward, go to the `Transactions` item in the sidebar, and `execute` the transaction to finish the authority upgrade.
11. Now go to the page of your newly added program, copy the URL, and cut the string after the last `/`
    1. It will look like this: `https://devnet.squads.so/programs/<ABCDEFG...12345>/<12345...ABCDEFG>`
    2. Copy the last piece of URL after the `/`
    3. Keep it safe, we will need to use it later.

Now we should have all the pieces in place to start setting up the multisig transactions on Nosana.

## Nosana

1. Fork the repository from https://github.com/solana-labs/example-helloworld to your GitHub account
2. Go to [app.nosana.io](https://app.nosana.io)
3. Sign up and import the fork of the `solana-labs/example-helloworld` to your Nosana account
4. When you are presented with choosing a template, choose the Squads one
5. In the `environment` object, add the respective keys to the following properties:
   1. AUTHORITY_PUBKEY: <Your-PubKey-Here>
   2. MULTISIG_PUBKEY: <Your-PubKey-Here>
   3. SQUADS_PUBKEY: <Your-PubKey-Here>
6. Go to `Secrets`
   1. Click `new secret`
   2. Add your key to the `secret` field
   3. Name it `SOLANA_WALLET`
7. Go back and `Commit Changes`
8. Make sure everything is correct for your pipeline.

Now, every time you make a change to your Solana program, every commit that is pushed back to the `main` branch will trigger a Nosana pipeline to run.
This will create a new transaction for you in the [Squads.so](https://devnet.squads.so) interface that you can execute.
After you execute it, the rest of your team will also need to sign the transaction in Squads in order for the deployment to happen.

Congrats! Your Solana program is no longer vulnerable to the issue of having a single upgrade authority.
