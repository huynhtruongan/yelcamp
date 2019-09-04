const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        methodOverride = require('method-override'),
        User        = require('./models/user'),
        seedDB      = require('./seeds')

    var commentRoutes       = require('./routes/comments'),
        campgroundRoutes    = require('./routes/campgounds'),
        indexRoutes         = require('./routes/index')
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true})
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(methodOverride('_method'))
//  seedDB();

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

app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
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




app.listen(3000,()=> console.log("The yelpCamp Server Has Started"))