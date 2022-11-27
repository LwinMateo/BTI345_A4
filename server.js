/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Lwin Yonal Mateo Lopez__________________ Student ID: ____134710201__________ Date: ___11-26-2022____________
*
* Online (Heroku Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 


const express = require("express");
const app = express();
// multer module
const multer = require("multer");
const path = require("path");

const exphbs = require('express-handlebars');

//include "fs" module
const fs = require("fs");
//const bodyParser = require("body-parser");
const dataService = require("./data-service.js");



app.use(express.json());
app.use(express.urlencoded({extended:true}));



//app.engine(".hbs", exphbs.engine({ extname: ".hbs",  defaultLayout: "main"}));
app.engine(".hbs", exphbs.engine({ extname: ".hbs",  

    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +'><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        }, 

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        } 
    }
}));


app.set("view engine", ".hbs");


app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: ", HTTP_PORT);
}




app.get("/", function(req, res){
    //res.sendFile(path.join(__dirname, 'views/home.html'));
    res.render("home");
})

app.get("/about", function(req, res){
    //res.sendFile(path.join(__dirname, 'views/about.html'));
    res.render("about");
})


// additional routes
app.get("/employees", function(req, res){
    console.log(req.query);


  if(Object.keys(req.query).length === 0){ //check if query is empty 
    dataService.getAllEmployees().then(function(data){
        if(data.length > 0){
            res.render("employees", {data : data});
        }
        else{
            res.render("employees", {message: "no results"});
        }
    })
    .catch(function(err){
       res.render({message: "no results"});
    })
  }
  else if (Object.keys(req.query).length !== 0){ //send params to getEmployees
    dataService.getAllEmployees(req.query).then(function(data){
      res.render("employees", {data : data});
      
    }).catch(function(err){
      
      res.render({message: "no results"});
    })
  }
});


app.get("/managers", function(req, res){
    
    dataService.getManagers().then((data) => {
        if(data.length > 0){
            res.render("managers", {data: data});
        }
        else{
            res.render("managers", {message: "no results"});
        }

        //res.json({data});
    }).catch(function(err){
        res.render({message: "no results"});
    });
});

app.get("/departments", function(req, res){
    
    dataService.getDepartments().then((data) => {
        if (data.length > 0){
            res.render("departments", {data : data});
          }
          else{
            res.render("departments", {data : "No results"});
          }
      }).catch((err) => {
        //res.render({message: "no results"});
        res.render("departments" , {data: err});
    });
})


// new servers
app.get("/employees/add", function(req, res){
    //res.sendFile(path.join(__dirname, 'views/addEmployee.html'));
    res.render("addEmployee");
});


app.post("/employees/add", function(req, res){
    dataService.addEmployee(req.body).then((data) => {
        console.log(data);
        res.redirect("/employees");
    }).catch(function(err){
        
        res.send(err);

    })

});

app.get("/employee/:empNum", function(req, res){
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }}).catch(() => {
                viewData.employee = null; // set employee to null if there was an error
        }).then(dataService.getDepartments).then((data) => {
                viewData.departments = data; // store department data in the "viewData" object as "departments"
        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching
        // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
       
       
});


app.get("/images/add", function(req,res){
    //res.sendFile(path.join(__dirname, 'views/addImage.html'));
    res.render("addImage");
});


/////////////
// multer variables
/////////////
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// serving photos
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});


// image route
app.get("/images", function(req, res){
    fs.readdir("./public/images/uploaded", function(err, items){
        //return res.json(items);
        res.render("images", {data: items});
    })
});


app.get("/*", function(req, res){
    
    //res.status(404).send("Page Not Found");
    res.status(404).sendFile(path.join(__dirname, 'views/error.html'));
})




app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(function(data){
        console.log(req.body);
        res.redirect("/employees");
  
    }).catch(function(err){
        res.status(500).send("Unable to Update Employee");
        res.send(err);
  
    })
});


// additional routes

app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});

app.post("/department/update", (req, res) => {
    dataService.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
    .catch((err)=>{
        
        res.status(500).send("ERROR: Unable to Update Department.");
      
    });
});

app.get("/department/:departmentId", (req, res) => {
    /*dataService.getAllEmployees(req.params).then((data) => {
        res.render("employee", { employee: data[0] });
    }).catch((err) => {
        res.render("employee",{error: err});
    });*/ 
    dataService.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", { department : data[0] });
    }).catch((err)=>{
        res.status(404).send("Department Not Found");
    });
});


// delete route
app.get("employees/delete/:empNum", (req, res) => {
    dataService.deleteEmployeeByNum(req.params.empNum).then(function(){
        res.redirect("/employees");
    }).catch(function(data){
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});



// to get connected to server
//app.listen(HTTP_PORT, onHttpStart);
dataService.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log('Initilization Failed! ', err);
});