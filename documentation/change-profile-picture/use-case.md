# Change Profile Picture

## Data
* User id
* Picture

## Primary flow
1. [x] Save picture receives in a FileStorage
2. [x] Send a unique key to the FileStorage for doest overwrite some image that exists
3. [x] Update the data from user with the URL of the picture returned from the FileStorage
4. [x] Clean the field with the user initials
5. [ ] Return the picture URL and the user initials

## Alternative flow 1: User remove the picture
1. [x] If the system doesn't receive a picture ignore steps 1 and 2
3. [x] Clean url picture from data of the user
4. [x] Update the field user initials with the first and last letter of the name

## Alternative flow 1.1: User doesn't have last name
4. [x] Update the field initials with the first two letters of the name

## Alternative flow 1.2: User has the name if only one letter
4. [x] Update the field initials from user if the one letter

## Alternative flow 1.3: User doesn't has name
4. [x] Clean the field initials from user name

## Exception flow: Error on update the user picture
1. [ ] Delete the picture created on FileStorage
2. [ ] Repass the same error received
