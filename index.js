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
                updateEmployee();
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
        console.log("---DISPLAYING ALL DEPARTMENTS---")
        console.table(res);
        menu();
    })
}

//VIEW ALL ROLES
const viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log("---DISPLAYING ALL ROLES---")
        console.table(res);
        menu();
    })
}
//VIEW ALL EMPLOYEES
const viewEmployees = () => {
    const sql = `SELECT A.id, A.first_name, A.last_name, role.title, department.department_name AS department, role.salary, concat(B.first_name, ' ', B.last_name) AS manager FROM employee A JOIN role ON A.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee B ON A.manager_id = B.id;`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log("---DISPLAYING ALL EMPLOYEES---")
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
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        const params = data.title;

        db.query(sql, params, (err, res) => {
            if (err) throw err;
        });
        console.log('---NEW DEPARTMENT ADDED TO THE DATABASE---');
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
            departmentArray.push(res[i].department_name)
        }

        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does this role belong to?',
                choices: departmentArray
            }
        ])
        .then ((data) => {
            const sql1 = `SELECT id FROM department WHERE department_name = '${data.department}'`

            db.query(sql1, (err, res) => {
                if (err) throw err;
                var departmentID = res[0].id;

                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                const params = [data.title, data.salary, departmentID];

                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                })
            })
            console.log('---NEW ROLE ADDED TO THE DATABASE---');
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

            inquirer .prompt ([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is this employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is this employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roleArray
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managerArray
                }
            ])
            .then ((data) => {

                const sql2 = `SELECT (SELECT role.id FROM role WHERE title = '${data.role}') AS role_id, (SELECT employee.id FROM employee WHERE concat(first_name, " ", last_name) = '${data.manager}') AS manager_id;`

                db.query(sql2, (err, res) => {
                    if (err) throw err;
                    var roleID = res[0].role_id;
                    var managerID = res[0].manager_id

                    // Inputs the first name, last name, role id, and manager id
                    const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    const params3 = [data.first_name, data.last_name, roleID, managerID]

                    db.query(sql3, params3, (err, res) => {
                        if (err) throw err;
                    })
                })
                console.log("---ADDED NEW EMPLOYEE TO THE DATABASE---")
                menu();
            });
        });
    });
};

//UPDATE AN EMPLOYEE
updateEmployee = () => {
    var employeeArray = [];

    const sql = `SELECT concat(first_name, ' ', last_name) AS employees FROM employee`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].employees)
        }

        let roleArray = [];
        const sql2 = `SELECT * FROM role`;
        db.query(sql2, (err, res) => {
            if (err) throw err;
            for (let x = 0; x < res.length; x++) {
                roleArray.push(res[x].title)
            }
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?",
                    choices: employeeArray
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What role do you want to assign this employee",
                    choices: roleArray
                }
            ])
            .then((data) => {
                const sql3 = `SELECT (SELECT role.id FROM role WHERE title = '${data.role}') AS role_id, (SELECT employee.id FROM employee WHERE concat(first_name, ' ', last_name) = '${data.employee};) AS employee_id;`
                db.query(sql3, (err, res) => {
                    if (err) throw err;
                    var roleID = res[0].role_id;
                    var employeeID = res[0].employee_id;

                    const sql4 = `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`;
                    db.query(sql4, (err, res) => {
                        if (err) throw err;
                    });
                })
                console.log("---EMPLOYEE'S ROLE UPDATED---");
                menu();
            });
        });
    });
};


menu();