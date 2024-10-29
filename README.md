## MoneySyncr Client

Front end for the MoneySyncr app, a one stop app for all of your banking needs.

## Get Started

You will need the [back end](https://github.com/tjaung/MoneySyncr_back/tree/main) to be running before you can do anything, so go set that up first before.

Once that's done, copy and paste this command in your terminal: https://github.com/tjaung/MoneySyncr_client.git

Go to the new directory and type in: "npm run dev" to start playing around with it.

## About

This is not just another budgeting app. It connects all your bank accounts with the Plaid API and Dwolla to allow you to transfer money to your all of your other accounts. I was sick of going to a bunch of different apps to move my own money around, so I took the liberty of creating my own app to do it all.

## Tech Stack

I used next.js for the skeleton and shadcn for a lot of the components. The front end was inspired by some youtube tutorials, but ultimately, I had to create a lot of the ui and functionality myself since I wanted to do things differently. The client side also includes files for server side activity, mainly implementing the Plaid and Dwolla apis. I wanted to use this on the django back end, but since my timeline was short, I ended up doing it with typescript since that was more familiar to me.

## Functions

The main dashboard includes overall data across all accounts. This includes total assets, monthly spending, top spending categories, and recent transactions. The transactions page goes in more detail by filtering for individual accounts for top spending categories and recent transactions. You can also transfer funds from account to account with Dwolla by selecting the sending account and inputting a receiver account with an encrypted id. You can get these encrypted ids from the accounts page. The encrypted ids is to ensure that you can't send funds to any other accounts that aren't also encrypted in the same way. 

