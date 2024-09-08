const router = require('express').Router();
const Task = require('../models/task');
const User = require('../models/user');
const authenticateToken = require('./auth');

router.post('/create-task',authenticateToken,async (req,res)=>{
    try{
        const {title,desc} = req.body;
        const newTask = new Task({title:title,desc:desc});
        const createdTask = await newTask.save();
        const {id} = req.headers;
        const taskId = createdTask._id;
        await User.findByIdAndUpdate(id,{$push:{tasks:taskId}});

        res.status(200).json({"message":"Task created successfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }

});

router.get('/all-tasks',authenticateToken,async (req,res)=>{
    try{
        const {id} = req.headers;
        const allTask = await User.findOne({_id:id}).populate({
            path:'tasks',
            match:{todo:true},
            options:{ sort :{ createdAt:-1}}
        });
        const allTasksData = allTask.tasks
        res.status(200).json({"data":allTasksData});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }

});

router.delete('/delete-task/:id',authenticateToken,async(req,res)=>{
    try{
        const {id} = req.params;
        const userId = req.headers.id;
        const response = await Task.findByIdAndDelete(id);

        let status = '';
        if(response.todo==true){status='todo';}
        else if(response.inProgress==true){status='inProgress';}
        else{status='complete';}

        console.log(response);
        await User.findByIdAndUpdate(userId,{$pull:{tasks:id}});
        res.status(200).json({"message" : "Task deleted successfully","status":status});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }

})

router.put('/update-task/:id',authenticateToken,async(req,res)=>{
    try{
        const {id} = req.params;
        const {title,desc}=req.body;
        await Task.findByIdAndUpdate(id,{title:title,desc:desc});
        res.status(200).json({"message" : "Task Updated successfully"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }
})

router.get('/all-tasks/inprogress',authenticateToken,async (req,res)=>{
    try{
        const {id} = req.headers;
        const allTask = await User.findOne({_id:id}).populate({
            path:'tasks',
            match:{inProgress:true},
            options:{ sort :{ createdAt:-1}}
        });
        const allTasksData = allTask.tasks
        res.status(200).json({"data":allTasksData});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }

});

router.get('/all-tasks/completed',authenticateToken,async (req,res)=>{
    try{
        const {id} = req.headers;
        const allTask = await User.findOne({_id:id}).populate({
            path:'tasks',
            match:{completed:true},
            options:{ sort :{ createdAt:-1}}
        });
        const allTasksData = allTask.tasks
        res.status(200).json({"data":allTasksData});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }
});
router.put('/tasks/todo/:id',authenticateToken,async (req,res)=>{
    try{
        const taskId = req.params.id;
        await Task.findByIdAndUpdate(taskId,{todo:true,inProgress:false,completed:false})
        return res.status(200).json({"message":"Task status changed to todo"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }
});

router.put('/tasks/inprogress/:id',authenticateToken,async (req,res)=>{
    try{
        const taskId = req.params.id;
        await Task.findByIdAndUpdate(taskId,{todo:false,inProgress:true,completed:false})
        return res.status(200).json({"message":"Task status changed to in-progress"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }
});

router.put('/tasks/completed/:id',authenticateToken,async (req,res)=>{
    try{
        const taskId = req.params.id;
        await Task.findByIdAndUpdate(taskId,{todo:false,inProgress:false,completed:true})
        return res.status(200).json({"message":"Task status changed to completed"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"message":"Internal Server Error"});
    }
});

module.exports = router;