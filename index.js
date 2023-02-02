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
        database: 'company_db',
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
    .then(data => {
        switch(data.menuList) {
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


//ADD A DEPARTMENT
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?'
        }
    ])
    .then ((data) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = data.name;

        db.query(sql, params, (err, res) => {
            if (err) throw err;
        });
        console.log('New department added to the database!');
        menu();
    })
}

//ADD A ROLE
const addRole = () => {
    var departmentArray = [];
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            departmentArray.push(res[i].name)
        }
    
        return inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department is this role a part of?',
                choices: departmentArray,
            }
        ])
        .then ((data) => {
            const findID = `SELECT id FROM department WHERE name = '${data.department}`

            db.query(findID, (err, res) => {
                if (err) throw err;
                var departmentID = res[0].id;

                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                const params = [data.name, data.salary, departmentID];

                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                })
            })
            console.log('New Role added to the database!')
            menu();
        });
    });
};

//ADD NEW EMPLOYEE
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