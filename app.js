const express = require("express");
const app = express();
const bodyParer= require("body-parser");
const mongoose = require("mongoose");
const { disable } = require("express/lib/application");
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});
              //without mongooose server
// var newlist=["buy food","eat food"]
var important=[];

app.use(bodyParer.urlencoded({extended:true}));

app.use(express.static("public"));
app.set("view engine", "ejs");

const itemSchema = mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({
     name:"welcome to your to do list"
});
const item2 = new Item({
    name:"what do you like ti watch"
});
const item3 = new Item({
    name:"i like your intention"
});
const defaultArray =[item1,item2,item3]
   // custom list name schema create

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List",listSchema);



app.get("/",function(req,res){
    var result=[];
    find();
    
    async function  find(){
        const result = await Item.find({});
        if (result.length ===0){
            Item.insertMany(defaultArray);
            res.redirect("/");
        }
        
        else{
            res.render("list",{itemHeading:"today", next:result})
        }
        
        
        console.log("here");
        console.log(result);
        // res.render("list",{itemHeading:"today", next:result})

    
       
    };
    
});
                  // express route params
    app.get("/:customListName", function(req,res){
        const customListName= req.params.customListName;

         findOne();
        async function findOne(){
          const foundList=  await List.findOne({name:customListName})
          if(!foundList){
            const list = new List({
                name:customListName,
                items: defaultArray
            }
    
            );
            list.save();
            res.redirect("/"+customListName)
          }
          else{
              res.render("list",{itemHeading:foundList.name, next:foundList.items})
          }
        }
       
        const list = new List({
            name:customListName,
            items: defaultArray
        }

        );
      
    });

//  var today= new Date;
//  var options={
//      weekend:"long",
//      month:"long",
//      day:"numeric"
//  }
//  var date= today.toLocaleDateString("en-us",options);
 



app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const item = new Item({
    name : itemName
    });
    item.save();
    res.redirect("/")

});
app.post("/delete",function(req,res){
     

    
    
    const check=req.body.checkboxx

deleteOne();
async function deleteOne(){
    await Item.deleteOne({_id:check})
    res.redirect("/")

}
  
});


       // old withpout mongoose
    // if (req.body.list === "important"){

  
    //     important.push(item);
    //     res.redirect("/important")
    // }
    // else {
    //     newlist.push(item);
    //     res.redirect("/");
    // }
    

app.get("/important",function(req,res){
    res.render("list",{itemHeading :"important", next:important})
})


app.listen(3000,function(){
    console.log("port starts at 3000")
});