var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
router.get("/", (req, res)=>{
    Campground.find({}, function(err, allCampground){
        if (err) console.log(err);
        else {
            res.render("campgrounds/index", {campgrounds: allCampground, currentUser: req.user})
        }      
    }) 
})

router.post("/",isLoggedIn ,(req, res) =>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, newlyCreate){
        if (err) console.log(err);
        else {
            console.log(newlyCreate);      
            res.redirect("/campgrounds");
        }   
    })  
})
router.get("/new",isLoggedIn,(req, res)=>{
    res.render("campgrounds/new");
})
router.get('/:id', (req, res)=>{
    
    
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
        console.log(foundCampground)
        if (err) console.log(err);
        else {
            
            res.render('campgrounds/show', {campground : foundCampground})
            
        }       
    })
})
router.get('/:id/edit', (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err) res.redirect('/campgrounds')
        else res.render('campgrounds/edit', {campground:foundCampground})
    })
})
router.put('/:id', (req, res)=>{
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err) res.redirect('/campgrounds');
        else res.redirect('/campgrounds/' + req.params.id);
    })
})
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
module.exports = router;