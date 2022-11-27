/*const express = require('express');
const fs = require("fs");
const path = require('path');

var employees = [];
var departments = [];*/
const Sequelize = require('sequelize');

var sequelize = new Sequelize('fhjrhnpe', 'fhjrhnpe', 'ADdBIQNcueAIyzpyPMmSCJAFWJafGQFz', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized : true }
    },
    query: { raw: true }
});


sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));


// defind a model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
});

var Department = sequelize.define('Department',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
});





exports.initialize=function(){
    
    return new Promise(function (resolve, reject) {
        //reject();
        sequelize.sync().then(function(){
            console.log("Functions Initialized");
            resolve();
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
       
};

exports.getAllEmployees=function(){

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function(){
            Employee.findAll({attributes : ['employeeNum']}).then(function(array_Employee){
                resolve(array_Employee);
            }).catch(function(err){
                console.log("No results in ", err);
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
       
};


/*exports.getManagers=function(){
    return new Promise(function (resolve, reject) {
        //reject();
        
    });       
    
};*/

exports.getDepartments=function(){
    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            Department.findAll({attributes : ['departmentId']}).then(department => {
                resolve(department);
            }).catch(function(err){
                console.log("No results in ", err);
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
};


exports.addEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for(var key in employeeData){
        if(employeeData[key] === " "){
            employeeData[key] = null;
        }
    }

    return new Promise(function (resolve, reject) {
        //reject();
        sequelize.sync.then(function(){
            Employee.create(employeeData).then(function(employee){
                resolve(employee);
            }).catch(function(err){
                console.log("unable to create employee");
                reject();
            })
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
};


// UPDATES
exports.getEmployeesByStatus = function(status){
    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            Employee.findAll({where:{status: status}}).then(employee => {
                resolve(employee);
            }).catch(function(err){
                console.log("No results in ", err);
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
       
};

exports.getEmployeesByDepartment = function(department){
    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            Employee.findAll({where:{department : department}}).then(employee => {
                resolve(employee);
            }).catch(function(err){
                console.log("No results in ", err);
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
       
};

exports.getEmployeesByManager = function(manager){
    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            Employee.findAll({where:{employeeManagerNum: manager}}).then(employee => {
                resolve(employee);
            }).catch(function(err){
                console.log("No results in ", err);
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
       
}; 

exports.getEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            Employee.findAll({where:{employeeNum: num}}).then(employee => {
                resolve(employee[0]);
            }).catch(function(err){
                console.log("No results in ", err);
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject(err);
        });
    });
       
};

exports.updateEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for(var key in employeeData){
        if(employeeData[key] === " "){
            employeeData[key] = null;
        }
    }

    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
           Employee.update(employeeData,{where : {employeeNum : employeeData.employeeNum}}).then(function(emp){
                resolve(emp);
           }).catch(function(err){
                console.log("unable to update employee");
                reject(err);
           });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
       
}




// additional functions
exports.addDepartment = function(departmentData){
    for(let key in departmentData){
        if(departmentData[key] === " "){
            departmentData[key] = null;
        }
    }

    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
           Department.create(departmentData).then(function(dep){
                resolve(dep);
           }).catch(function(err){
                console.log("unable to create department");
                reject(err);
           });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });
};

exports.updateDepartment = function(departmentData){
    for(let key in departmentData){
        if(departmentData[key] === " "){
            departmentData[key] = null;
        }
    }

    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            //employeeData,{where : {employeeNum : employeeData.employeeNum}}
           Department.update(departmentData, {where : {departmentId : departmentData.departmentId}}).then(function(dep){
                resolve(dep);
           }).catch(function(err){
                console.log("unable to update department");
                reject(err);
           });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject();
        });
    });

};

exports.getDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        sequelize.sync.then(function(){
            Department.findAll({where:{departmentId : id}}).then(department => {
                resolve(department[0]);
            }).catch(function(err){
                console.log("No results returned");
            });
        }).catch(function(err){
            console.log("unable to sync the database", err);
            reject(err);
        });
    });
}


// DELETING
exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function(resolve, reject){
        sequelize.sync.then(function(){
            Employee.destroy({where : {employeeNum : empNum}}).then(employee => { 
                resolve("destroyed") 
            }).catch(function(err){
                console.log("Not Destroyed!");
                reject(err);
            });
        }).catch(function(err){ 
            console.log("Unable to sync the database");
            reject(err)
        })
    });
}