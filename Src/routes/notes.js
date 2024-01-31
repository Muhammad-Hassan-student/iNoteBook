const express=require('express');
const router=express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require("../model/Notes");
const { body, validationResult } = require("express-validator");
 

 //rout 1 for fetch all notes
   //Fetch All Notes  --Get _"/api/auth/fetchallnotes". login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{

  try {
    
    const notes=await Notes.find({user: req.user.id});
    res.json(notes)
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


 //rout 2 for add all notes description 
  //Add All Notes  --Post _"/api/notes/fetchallnotes". login required
  router.get('/addnote',fetchuser,[
    body("title", "Enter a valid title").isLength({ min: 3 }),
   
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],async (req,res)=>{
    try {
      
    const {title, description,tag}=req.body;
    //if there are errors ,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }const note = new Notes({
        title,description,tag, user: req.user.id
    })
    const savedNote=await note.save();
    res.json(savedNote)
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
})

 //rout 3 for add all notes description 
  //update an existing note by using  --Put _"/api/notes/updatenote". login required
  router.put('/updatenote/:id',fetchuser,async (req,res)=>{

    const {title,description,tag}=req.body;
    //create a new note object
    try {
    const newNote={};

      
    
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};


    //find the  note to be updated ans updated it 

   //first we check that user note is exist or not 
   let note= await Notes.findById(req.params.id);
   if(!note){
    return res.status(404).send("Not Found");
   }
   if(note.User !== req.user.id){
    return res.status(401).send("Not Allowed");
   }

   note = await Notes.findByIdAndUpdate(req.params.id ,{$set:newNote}, {new : true}) 
   res.json(note);

  
  
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
      
   }})


  //rout 3 for add all notes description 
  //update an existing note by using  --Put _"/api/notes/updatenote". login required
  router.delete('/deletenote/:id',fetchuser,async (req,res)=>{

    const {title,description,tag}=req.body;
    try {
      
     
   

    //find the  note to be deleted and deleted it 

   //first we check that user note is exist or not 
   let note= await Notes.findById(req.params.id);
   if(!note){
    return res.status(404).send("Not Found");
   }
   if(note.User !== req.user.id){
    return res.status(401).send("Not Allowed");
   }

   note = await Notes.findByIdAndDelete(req.params.id ) 
   res.json({"secess":"Delete Successful"});

  }catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
      
   }
  
  })
module.exports=router;