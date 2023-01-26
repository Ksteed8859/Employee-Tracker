const inquirer = require('inquirer');

//Main Menu
const menu = () => {
    return inquirer.prompt( [
        {
            type: 'list',
            name: 'menuList',
            message: 'What would you like to do?',
            choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
        }
    ])
    .then(answers => {
        const userInput = answers.menuList;
        if (userInput === "View all Departments") {
            //ADD CODE HERE
        } else if (userInput === "View all Roles") {
            //ADD CODE HERE
        } else if (userInput === "View all Employees") {
            //ADD CODE HERE
        } else if (userInput === "Add a Department") {
            addDepartment();
        } else if (userInput === "Add a Role") {
            addRole();
        } else if (userInput === "Add an Employee") {
            addEmployee();
        } else if (userInput === "Update an Employee Role") {
            //ADD CODE HERE
        }
    })
}

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
            message: 'What is this employees first name?'

        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is this employees last name?'
        },
        {
            type: 'input',
            name: 'role',
            message: 'What is this employees role?',
        },
        {
            type: 'input',
            name: 'manager',
            message: 'Who is this employees manager?',
        }
    ])
}