const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        Campground  = require('./models/campground'),
        seedDB      = require('./seeds')

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true})
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")


// Campground.create(
//     {
//         name : "Salmon Creek",
//         image : "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
//         description : "this is description"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("newly campground create");
//             console.log(campground);  
//         }
//     })

let campgrounds = [
    {name: "Salmon Creek", image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"},
    {name: "Granite Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1GBCY_MsQLfN1xEJAuwyB1-td-NJINX7x-LjKq0fz2xuQeeL"},
    {name: "Mountain Goat's Rest", image:"https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg"}
]

app.get("/", (req, res)  => res.render("campgrounds/landing"))

app.get("/campgrounds", (req, res)=>{
    Campground.find({}, function(err, allCampground){
        if (err) console.log(err);
        else {
            res.render("campgrounds/index", {campgrounds: allCampground})
        }      
    }) 
})

app.post("/campgrounds", (req, res) =>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreate){
        if (err) console.log(err);
        else res.redirect("/campgrounds");   
    })  
})
app.get("/campgrounds/new",(req, res)=>{
    res.render("campgrounds/new");
})
app.get('/campgrounds/:id', (req, res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
        console.log(foundCampground)
        if (err) console.log(err);
        else {
            
            res.render('campgrounds/show', {campground : foundCampground})
            
        }       
    })
})
app.get('/campgrounds/:id/comments/new', (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) console.log(err);
        else {
            res.render('comments/new', {campground: campground})
        }
        
    })
})
app.listen(3000,()=> console.log("The yelpCamp Server Has Started"))