const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        Campground  = require('./models/campground'),
        Comment    = require('./models/comment'),
        User        = require('./models/user'),
        seedDB      = require('./seeds')


mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true})
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")
seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'You, little bitch!',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
})
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

// let campgrounds = [
//     {name: "Salmon Creek", image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"},
//     {name: "Granite Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1GBCY_MsQLfN1xEJAuwyB1-td-NJINX7x-LjKq0fz2xuQeeL"},
//     {name: "Mountain Goat's Rest", image:"https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg"}
// ]

app.get("/", (req, res)  => res.render("campgrounds/landing"))

app.get("/campgrounds", (req, res)=>{
    Campground.find({}, function(err, allCampground){
        if (err) console.log(err);
        else {
            res.render("campgrounds/index", {campgrounds: allCampground, currentUser: req.user})
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
app.get('/campgrounds/:id/comments/new',isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) console.log(err);
        else {
            res.render('comments/new', {campground: campground})
        }
        
    })
})
app.post('/campgrounds/:id/comments',isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) console.log(err);
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);    
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+ campground._id);
                }
            })
        }
    })
})
//---------------------
//AUTH ROUTES
//---------------------
// register
app.get('/register',(req, res)=>{
    res.render('register');
})
app.post('/register', (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res, ()=>{
            res.redirect('/campgrounds');
        })
    })
})
// login
app.get('/login',(req, res)=>{
    res.render('login');
})
app.post('/login',passport.authenticate('local', 
    {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
    }
), (req, res)=>{

})
// logout
app.get('/logout',(req, res)=>{
    req.logout();
    res.redirect('/campgrounds');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
app.listen(3000,()=> console.log("The yelpCamp Server Has Started"))