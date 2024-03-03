const express = require("express");
const users = require('./MOCK_DATA.json')
const app = express();
const PORT = 8000;
const fs = require('fs')
const mongoose = require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017')
const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required : true
    },
    lastname:{
        type: String,
        required : true
    },
    email:{
        type: String,
        reuired: true,
        unique: true
    },
    jobTitle:{
        type: String,
    }
})

const User = mongoose.model("user",userSchema);
//middleware
//yeh har req per chalta hai aur yeh data ko uthaya aur ausko js object mein covert krdia aur fir re.body mei daal dia 
app.use(express.urlencoded({extended : false}));
//middleware for log file 
app.use((req,res,next) => {
    fs.appendFile("log.txt",`\n${Date.now()}:${req.ip} ${req.method}: ${req.path}}`,(err,data) => {
        next();
    });
});

//routes
app.get('/users', (req,res) => {
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

//API
//WHY writen api in api.users coz it is the best practice if we want to use our application in web as well as mobline i.e. cross platformed so thats why we use api
// if there is written api thenit will throw JSON data else html data

app.get("/api/users", (req,res) => {
    return res.json(users);
})

app.get("/api/users/:id", (req,res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
});

app.post("/api/users",(req,res) => {
    const body = req.body;
    // console.log("BODY",body);
    if(!body || !body.first_name || !body.last_name || !body.gender){
        return res.status(400).json({msg : 'All fields are mandatory'})
    }

    users.push({...body,id : users.length + 1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data) => {
            return res.json({status:"pending"})
    });
    
})


app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));