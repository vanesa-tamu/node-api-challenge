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

router.get('/:actionID', validateActionID, (req,res) => {
res.status(200).json(req.action);
})

//Middleware to vlaidate project ID
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
//Middleware to vlaidate action ID
async function validateActionID(req,res,next) {
    const { actionID } = req.params;
    try{
        const action = await Action.get(actionID)
        if(action){
            req.action = action
            next();
        }
        else{
            res.status(404).json({error: `Action with id of ${actionID} does not exist for the queried project`});
        }
    }
    catch(error){
        res.status(500).json({ message: "There was an error validating that Action." });
    }
}

module.exports = router