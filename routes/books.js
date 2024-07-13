const express = require("express");
const router = express.Router();
const { Book } = require("../models");
const { Op, where } = require("sequelize");
const yup = require("yup");

router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Op.or] = [
      {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        author: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        publishedYear: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        category: {
          [Op.like]: `${search}`,
        },
      },
    ];
  }
  let list = await Book.findAll({
    where: condition,
    order: [["createdAt", "DESC"]],
  });
  res.json(list);
});

router.post("/", async (req, res) => {
  let data = req.body;
  let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    author: yup.string().trim().min(3).max(100).required(),
    publishedYear: yup.number().integer().min(1000).required(),
    category: yup.string().trim().min(3).max(100).required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // if okay, process data
    let result = await Book.create(data);
    res.json(result);
  } catch (error) {
    // write the error msg inside the json if no data can be processed
    res.status(400).json({errors:error.errors})
  }
});

// find by pk
router.get('/:id', async(req,res)=>{
    let id = req.params.id;
    let data = await Book.findByPk(id);
    if(!data){
        res.sendStatus(404);
        return;
    }
    res.json(data);
})
// update by pk
router.put('/:id', async(req,res)=>{
    let id = req.params.id;
    let data = req.body;
    let exist = await Book.findByPk(id)
    if(!exist){
        res.sendStatus(404);
        return;
    }
    else{
        let validationSchema = yup.object({
            title: yup.string().trim().min(3).max(100).required(),
            description: yup.string().trim().min(3).max(500).required(),
            author: yup.string().trim().min(3).max(100).required(),
            publishedYear: yup.number().integer().min(1000).required(),
            category: yup.string().trim().min(3).max(100).required(),
          });
        try {
            data = await validationSchema.validate(data,{abortEarly:false}) 
            // trying to update
            let updating = await Book.update(data,{
                where:{id:id}
            })
            if(updating == 1){
                res.json({
                    message:"updated successfully"
                })
            }
            else{
                res.status(400).json({
                    errors:`Cannot update book with id ${id}`
                })
            }
        } catch (error) {
            res.status(400).json({errors:error.errors})
        }
        
    }
})

router.delete('/:id', async(req,res)=>{
    let id = req.params.id;
    let found = await Book.findByPk(id);
    if(!found){
        res.sendStatus(404);
        return;
    }
    else{
        let data = await Book.destroy({
            where:{id:id}
        });
        if(data == 1){
            res.json({
                message:'Deleted successfully'
            })
        }
        else{
            res.status(400).json({
                message:`Cannot delete the book with id ${id}`
            })
        }
    }
})

module.exports = router;
