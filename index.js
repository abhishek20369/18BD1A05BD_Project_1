const { request } = require("express");
var express=require("express");
var app=express();

//Linking server and JWT
let server=require('./server');
let middleware=require('./middleware');

//Creating instances for mongoClient and bodyParser
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalInventory';
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
let db

//Connecting to mongoDB
MongoClient.connect(url,{ useUnifiedTopology: true },(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database : ${url}`);
    console.log(`Database : ${dbName}`);
});

//Add new Hospital details
app.post('/addHospital',middleware.checkToken,(req,res)=>{
    console.log(req.body);
    db.collection('hospital').insertOne(JSON.parse(JSON.stringify(req.body))).then(result=>{console.log("1 hos inserted")});
    res.send("added hospital : "+JSON.stringify(req.body));
});

//Getting all hospitals details
app.get('/hospitalDetails',middleware.checkToken,(req,res)=>{
    console.log("getting hospitals details");
    const data=db.collection("hospital").find().toArray().then(result=>res.send(result));
});

//Getting details of particular hospital
app.post('/searchHospitalByName',middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log("getting hospital details");
    const data=db.collection("hospital").find({"name":name}).toArray().then(result=>res.send(result));
});

//adding new Ventilator details
app.post('/addVentilator',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var vId=req.body.vId;
    var status=req.body.status;
    var name=req.body.name;
    console.log(req.body);
    db.collection('Ventilator').insertOne({"hId":hId, "vId":vId, "status":status, "name":name});
    res.send("added ventilator :"+JSON.stringify(req.body));
});

//Getting all Ventilators details
app.get('/ventilatorDetails',middleware.checkToken,(req,res)=>{
    console.log("getting ventilators details");
    const data=db.collection("Ventilator").find().toArray().then(result=>(res.send(result)));
});

//Searching ventilator by status
app.post('/searchVentilatorByStatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log("getting ventilator details");
    const data=db.collection("Ventilator").find({"status":status}).toArray().then(result=>(res.send(result)));
});

//Searching ventilator by hospital name and status
app.post('/searchVentilatorByHospitalName',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    var name=req.body.name;
    console.log("getting ventilator details");
    const data=db.collection("Ventilator").find({"name":name,"status":status}).toArray().then(result=>(res.send(result)));
});

//Searching ventilator by ventilator id
app.post('/searchVentilatorById',middleware.checkToken,(req,res)=>{
    var vId=req.body.vId;
    console.log("getting ventilator details");
    const data=db.collection("Ventilator").find({"vId":vId}).toArray().then(result=>(res.send(result)));
});

//updating ventilator status
app.put('/updateVentilator',middleware.checkToken,(req,res)=>{
    const vId=req.body.vId;
    const status=req.body.status;
    console.log("updating ventilator status");
    db.collection("Ventilator").updateOne({"vId":vId},{$set:{"status":status}});
    res.send("updated Ventilator :"+JSON.stringify(req.body));
});

//deleting a particular ventilator
app.delete('/deleteVentilator',middleware.checkToken,(req,res)=>{
    var vId=req.body.vId;
    console.log("deleting ventilator");
    db.collection("Ventilator").deleteOne({"vId":vId},function(err,obj){
        if(err) throw err;
        res.send("deleted ventilator : "+JSON.stringify(req.body));
    });
});
app.listen(3000);