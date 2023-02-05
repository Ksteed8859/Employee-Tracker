# KS Employee Tracker

## Description

Using the terminal, this application allows for users to view all the departments, roles, and employees in a company database as well as add new departments, roles, and employees or update current employees within the database.

## Installation

1. To install all the node modules required for this project to work, type: 'npm i' into the terminal. 
2. Users must create a .env file containing a DB_USER and DB_PASSWORD in order to connect to the database. The .env file should be set up as follows:

DB_NAME='exampleDatabase_db'
DB_USER='exampleName'
DB_PASSWORD='examplePassword'

## Usage

To load up the database, all users must first sign into mysql and type 'source db/schema.sql'. After that, if you would like to seed the database with preexisting data, type 'source db/seeds.sql'. Else, exit mysql.

Then simply type 'node index.js' to begin the application. Select what item you'd like to do, then follow the prompts provided. To exit the application, click the 'exit' option.

The following video shows the functionality of the application.

https://drive.google.com/file/d/1TK6x4sKmSLSxmUJ8YGfUwoZaDSNZeN4T/view