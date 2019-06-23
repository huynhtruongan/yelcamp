const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")

let campgrounds = [
    {name: "Salmon Creek", image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"},
    {name: "Granite Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1GBCY_MsQLfN1xEJAuwyB1-td-NJINX7x-LjKq0fz2xuQeeL"},
    {name: "Mountain Goat's Rest", image:"https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg"}
]

app.get("/", (req, res)  => res.render("landing"))

app.get("/campgrounds", (req, res)=>{
    res.render("campgrounds", {campgrounds: campgrounds})
})

app.post("/campgrounds", (req, res) =>{
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new",(req, res)=>{
    res.render("new.ejs");
})
app.listen(3000,()=> console.log("The yelpCamp Server Has Started"))