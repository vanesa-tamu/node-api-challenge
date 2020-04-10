const router = require('express').Router();
const Action = require('./data/helpers/actionModel.js')
const Project = require('./data/helpers/projectModel.js')
//GET all actions (I added this to the model)
router.get('/', async (req, res) => {
    try{
        const actions = await Action.all()
        if(actions){
            res.status(200).json(actions)
        }
    }
    catch(error) {
        res.status(500).json({message: 'error getting all projects'})
    }
});

//GET all actions for a specific project
router.get('/project/:id', validateProjectID,  (req,res) => {
 
    if(req.project.actions.length == 0){
    return res.status(200).json({error: `you do not have any actions at the moment for this project`})
    }
    else{
        res.status(200).json(req.project.actions);
    }

})
//GET action with specific ID
router.get('/:actionID', validateActionID, (req,res) => {
res.status(200).json(req.action);
})
//POST an action to a specific project 
router.post('/:id', validateProjectID, validateActionPost, async (req,res) => {
    const { id } = req.params;
    try{
        const newAction = await Action.insert(req.body)
        if(newAction){
            res.status(201).json(newAction);
        }
        else{
            res.status(500).json({message: `There was an error in inserting this action POST`});
        }
    }
    catch(error){
        // console.log('ACTION POST /:id', error)
        res.status(500).json({error: `There was an error in adding a new action to the project with ID ${id}`});
    }
})
//PUT an action 
router.put('/:actionID', validateActionID, async (req,res) => {
    const { actionID } = req.params;
    const updateAction = req.body;

    try{
        const update = await Action.update(actionID, updateAction)
        if(update){
            const updatedAction = await Action.get(actionID)
            res.status(200).json(updatedAction);
        }
        else{
            res.status(500).json({error: `error in getting the new, updated action`})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: `error in updating action with id of ${actionID} with project ID: ${id}`})
    }
})

router.delete('/:id/:actionID', validateProjectID, validateActionID, async (req,res) => {
    const { id } = req.params;
    const { actionID } = req.params;
    try{
        const deleting = await Action.remove(actionID)
        if(deleting){
            res.status(204).json({message: `you have successfully deleted the ACTION associated with Project ID: ${id}`})
        }
    }
    catch(error){
        res.status(500).json({error: `There has been an error in deleting project ${id}'s action with ID ${actionID}!`})
    }
})

//Middleware to validate project ID
async function validateProjectID(req,res, next) {
    const { id } = req.params;
    try {
        const project = await Project.get(id)
        if(project) {
            req.project = project
            next();
        }
        else {
            res.status(404).json({ message: "Invalid Project ID." });
        }
    }
    catch(error) {
        res.status(500).json({ message: "There was an error validating that Project." });
    }
}
//Middleware to validate action ID
async function validateActionID(req,res,next) {
    const { actionID } = req.params;
    try{
        const action = await Action.get(actionID)
        if(action){
            req.action = action
            next();
        }
        else{
            res.status(404).json({error: `Action with id of ${actionID} does not exist`});
        }
    }
    catch(error){
        res.status(500).json({ message: "There was an error validating that Action." });
    }
}
//Middleware to validate an action POST to a specific Project
async function validateActionPost(req,res,next) {
    const { project_id } = req.body;
    const { description } = req.body;
    const { notes } = req.body;

    try{
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({ message: "Missing action info" });
        } 
        if(!project_id){
            return res.status(400).json({ error: `Please provide a PROJECT_ID for a new project!`});
        }
        if(!description){
            return res.status(400).json({ error: `Please provide a DESCRIPTION for a new project!`});
        }
        if(!notes){
            return res.status(400).json({ error: `Please provide NOTES for a new project!`});
        }
        
        if(description.length === 0){
            return res.status(400).json({ error: `DESCRIPTION has to be longer.`});
        }
    
        if(typeof description !== "string"){
            return res.status(400).json({ error: `Please provide STRING for name`});
        }
        if(typeof notes !== "string"){
            return res.status(400).json({ error: `Please provide STRING for description`});
        }
        if(typeof project_id !== "number"){
            return res.status(400).json({ error: `Please provide NUMBER for project_id`});
        }
    
        const projectExists = await Project.get(project_id)
        if(!projectExists){
            res.status(404).json({ message: "Invalid PROJECT_ID." });
        }
    
        req.body = { project_id, description, notes }
        next();
    }
    catch(error){
        res.status(500).json({ message: "There was an error validating that action POST" })
    }
}



//Middleware to validate an action POST to a specific Project
// async function validateActionPost(req,res,next) {
//     const { project_id } = req.body;
//     const { description } = req.body;
//     const { notes } = req.body;

//     if (Object.keys(req.body).length === 0) {
//         res.status(400).json({ message: "Missing action info" });
//     } 
//     if(!project_id){
//         return res.status(400).json({ error: `Please provide a PROJECT_ID for a new project!`});
//     }
//     if(!description){
//         return res.status(400).json({ error: `Please provide a DESCRIPTION for a new project!`});
//     }
//     if(!notes){
//         return res.status(400).json({ error: `Please provide NOTES for a new project!`});
//     }
    
//     if(description.length === 0){
//         return res.status(400).json({ error: `DESCRIPTION has to be longer.`});
//     }

//     if(typeof description !== "string"){
//         return res.status(400).json({ error: `Please provide STRING for name`});
//     }
//     if(typeof notes !== "string"){
//         return res.status(400).json({ error: `Please provide STRING for description`});
//     }
//     if(typeof project_id !== "number"){
//         return res.status(400).json({ error: `Please provide NUMBER for project_id`});
//     }
    
//     const projectExists = await Project.get(project_id)
//     if(!projectExists){
//         res.status(404).json({ message: "Invalid PROJECT_ID." });
//     }

//     req.body = { project_id, description, notes }
//     next();
// }

module.exports = router