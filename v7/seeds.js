const mongoose = require('mongoose')
let Campground = require('./models/campground')
let Comment = require('./models/comment')
let data = [
    {
        name : "Salmon Creek",
        image : "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
        description : "this is description"
    },
    {
        name : "Granite Hill",
        image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1GBCY_MsQLfN1xEJAuwyB1-td-NJINX7x-LjKq0fz2xuQeeL",
        description : "this is description"
    },
    {
        name : "Mountain Goat's Rest",
        image : "https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg",
        description : "this is description"
    },
    {
        name : "Mutac",
        image : "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
        description : "this is description"
    },
]

let seedDB = () => {
    Campground.deleteOne({}, (err)=>{
        if(err){
            console.log(err);       
        }else {
            console.log('removed campgrounds!');
            data.forEach((seed)=>{
                Campground.create(seed, (err, campground)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log('added a campground');
                        // Create a comment
                        Comment.create(
                            {
                                text: 'this place is great',
                                author: 'no name'
                            }, (err, comment)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                    campground.comments.push(comment)
                                    campground.save()
                                    console.log('create new comment');
                                    
                                }
                            }
                        )
                    }
                })
            })
        }
    })
}
module.exports = seedDB;