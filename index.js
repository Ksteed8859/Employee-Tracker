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
                viewDepartments();
                break;
            case 'View all Roles':
                viewRoles();
                break;
            case 'View all Employees':
                viewEmployees();
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

//VIEW ALL DEPARTMENTS 
const viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log("Displaying all Departments")
        console.table(res);
        menu();
    })
}

//VIEW ALL ROLES
const viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log("Displaying all Roles")
        console.table(res);
        menu();
    })
}
//VIEW ALL EMPLOYEES
const viewEmployees = () => {
    const sql = `SELECT A.id, A.first_name, A.last_name, role.title, department.name AS department, role.salary, concat(B.first_name, ' ', B.last_name) AS manager FROM employee A JOIN role ON A.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee B ON A.manager_id = B.id;`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log("Displaying all Employees")
        console.table(res);
        menu();
    })
}
//ADD NEW DEPARTMENT
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the new department?'
        }
    ])
    .then ((data) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = data.title;

        db.query(sql, params, (err, res) => {
            if (err) throw err;
        });
        console.log('New department added to the database!');
        menu();
    })
}

//ADD NEW ROLE
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
                name: 'title',
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
                const params = [data.title, data.salary, departmentID];

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
    var roleArray = [];

    const sql = `SELECT * FROM role`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title)
        }

        var managerArray = [];

        const sql1 = `SELECT concat(first_name, ' ', last_name) AS managers FROM employee`;
        db.query(sql1, (err, res) => {
            if (err) throw err;
            for (let x = 0; x < res.length; x++) {
                managerArray.push(res[x].managers)
            }

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
                    type: 'list',
                    name: 'role',
                    message: "What is this employee's role?",
                    choices: roleArray,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is this employee's manager?",
                    choices: managerArray,
                }
            ])
            .then((data) => {
                const sql2 = `SELECT (SELECT role.id FROM role WHERE title = '${data.role}'AS role_id, (SELECT employee.id FROM employee WHERE concat(first_name, " ", last_name) = '${data.manager}') AS manager_id;`
                db.query(sql2, (err, res) => {
                    if (err) throw err;
                    var roleID = res[0].role_id;
                    var managerID = res[0].manager_id

                    const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    const params3 = [data.firstName, data.lastName, roleID, managerID]

                    db.query(sql3, params3, (err, res) => {
                        if (err) throw err;
                    })
                })
                console.log('Added new employee to the database')
                menu();
            });
        });
    });
};


menu();