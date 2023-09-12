const express = require('express');
let router = express.Router();
const multer = require('multer');
let path = require("path");
const Recipe = require('../models/Postmodel')
const authenticate = require('../middleware/authentication')


// create new recipe

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    },
  });
  
  let upload = multer({
    storage: storage,
  });


router.post('/', authenticate,upload.single('file'),async (req,res)=>{
    try{
        const {title,ingredients,instruction,imageUrl,}= req.body
        const author = req.userData.userId;
        // console.log(author)
        console.log("Uploaded image file path:", req.file.filename);

        const newRecipe = new Recipe({
            title,
            ingredients,
            instruction,
            imageUrl:req.file.filename,
            author ,
        })


        // console.log(newRecipe)

        await newRecipe.save();

        res.status(201).json({message:'Recipe created successfully'});
    }catch(error){
        res.status(500).json({message:'An error occured'})
    }
})

// Get all recipes

router.get('/', async (req,res)=>{
    try{
        const recipes = await Recipe.find().populate('author','email');
        // console.log(recipes)
        res.json(recipes)
    }catch(error){
        res.status(500).json({message:'An error occured'})
    }
})


router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
    try {
      // Extract search criteria from the query parameters
      const { query } = req.query;
  
      // Define your search criteria here (e.g., title or ingredients)
      const searchCriteria = {
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive title search
           // Case-insensitive ingredients search
        ],
      };
  
      // Query the database with the search criteria
      const recipes = await Recipe.find(searchCriteria).populate('author', 'email');
  
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  
// update a Recipe

router.put('/:id',authenticate,upload.single('file'), async (req,res)=>{
    try{
        // const { title, ingredients, instruction} = req.body;
        const author = req.userData.userId;
        let id  = req.params.id
       let updatedContent = req.body
        // const recipe = await Recipe.findById(req.params.id);

        

    // recipe.title = title;
    // recipe.ingredients = ingredients;
    // recipe.instruction = instruction;
    // recipe.imageUrl = req.file.filename;

  
     Recipe.findByIdAndUpdate({_id:id,author:author},updatedContent).then((data)=>{
      if(data){
        res.json({ message: 'Recipe updated successfully' });
      }else{
        res.status(403).json('Not Found')
      }
     }).catch(err=>{
      res.status(404).json('Not authorized to edit this recipe')
     })
  ;
   
    }catch (error){
      
        res.status(500).json({message:'An error occurred'})
    }
})

// Delete a recipe

router.delete('/:id',authenticate,async (req,res)=>{
    try{
        const author = req.userData.userId
      
        const recipe = await Recipe.findById(req.params.id)
      

        if(!recipe){
            return res.status(404).json({message:'Recipe not found'})
        }

        else if(recipe.author.toString() !== author){
            return res.status(403).json({message:'Not authorized to delete this recipe'});
        }else{
        await recipe.deleteOne()

        res.status(201).json({message: 'Recipe deleted successfully'})
        }
    }catch (error){
        res.status(500).json({message:'An errors occurred'})
    }
})

module.exports = router