const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Enable access to .env variables
require('dotenv').config();

//Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log('Connected to the company_db database.')
);

//Main Menu
const menu = () => {
    return inquirer.prompt( [
        {
            type: 'list',
            name: 'menuList',
            message: 'What would you like to do?',
            choices: ['View all Departments',
                     'View all Roles', 
                     'View all Employees', 
                     'Add a Department', 
                     'Add a Role', 
                     'Add an Employee', 
                     'Update an Employee Role',
                     'Exit']
        }
    ])
    .then(answers => {
        switch(answers.menuList) {
            case 'View all Departments':
                //ADD CODE HERE
                break;
            case 'View all Roles':
                //ADD CODE HERE
                break;
            case 'View all Employees':
                //ADD CODE HERE
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                //ADD CODE HERE
                break;
            case 'Exit':
                console.log("Bye!");
                process.exit(0);
        };
    });
};


//Inquirer Prompts for adding Data
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of this department?'
        }
    ])
}

const addRole = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of this role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
        },
        {
            type: 'input',
            name: 'department',
            message: 'What department is this role a part of?'
        }
    ])
}

const addEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is this employee's first name?"

        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is this employee's last name?",
        },
        {
            type: 'input',
            name: 'role',
            message: "What is this employee's role?",
        },
        {
            type: 'input',
            name: 'manager',
            message: "Who is this employee's manager?",
        }
    ])
}