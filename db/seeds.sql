INSERT INTO department (department_name)
VALUES ("Human Resources"),
       ("Finance"),
       ("IT"),
       ("Marketing"),
       ("Production");

INSERT INTO role (title, salary, department_id)
VALUES ("Internal Affairs", 75000, 1),
       ("Morale Officer", 40000, 1),
       ("Finance Lead", 80000, 2),
       ("Financial Advisor", 75000, 2),
       ("Head Engineer", 100000, 3),
       ("Assistant Engineer", 80000, 3),
       ("Sales Manager", 80000, 4),
       ("Customer Service Assistant", 50000, 4),
       ("Quality Assurance Lead", 60000, 5),
       ("Manufacturer", 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ethan", "Holmes", 1, NULL),
       ("Dennis", "Marks", 2, 1),
       ("Elaine", "Harrison", 3, NULL),
       ("Jason", "Wade", 4, 3),
       ("Annie", "Louve", 5, NULL),
       ("Johanna", "Benson", 6, 5),
       ("Damian", "Grant", 7, NULL),
       ("Sam", "Strong", 8, 7),
       ("Lucy", "Martinez", 9, NULL),
       ("Cory", "Homestead", 10, 9);
       
