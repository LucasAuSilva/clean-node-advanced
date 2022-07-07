# Authentication with Facebook

## Data
* Access Token

## Primary flow
1. [x] Get the data (name, email and Facebook ID) from the Facebook API
2. [x] Check if exists an user with the email provided
3. [x] Create an account for the user with the data provided by Facebook
4. [x] Create an Access Token, by the user ID, with expiration of 30 min
5. [x] Return the Access Token generated

## Alternative flow: User already exists
3. [x] Update the account from user with the data provided by Facebook (Facebook ID and name - only update name if user account doesn't have one)

## Exception flow
1. [x] Return an authenticate error
