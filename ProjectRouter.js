const router = require('express').Router();
const Project = require('./data/helpers/projectModel.js')
//GET all projects (I added this to the model)
router.get('/', async (req, res) => {
    try{
        const projects = await Project.all()
        if(projects){
            res.status(200).json(projects)
        }
    }
    catch(error) {
        res.status(500).json({message: 'error getting all projects'})
    }
});
//GET prject with specific id
router.get('/:id', validateProjectID, (req,res) => {
    res.status(200).json(req.project);
})
//GET actions of specific project
router.get('/:id/actions', validateProjectID, async (req,res) => {
    const { id } = req.params;
    try{
        const pActions = await Project.getProjectActions(id)

        if(pActions.length == 0 ) {
            return res.status(401).json({error: `you do not have any actions at the moment for this project`})
        }
        else{
            res.status(200).json(pActions)
        }
    }
    catch(error) {
        res.status(500).json({error: `error in retrieving actions for project with ID: ${id}`});
    }
});
//POST a project with a name and description
router.post('/', validateProjectPOST, async (req,res) => {
    const newProject = req.body;
    try{
        const project = await Project.insert(newProject)
        if(project){
            res.status(201).json(project)
        }
    }
    catch(error){
        res.status(500).json({ message: `There was an error creating that new project`});
    }
})
//PUT an existing project with changes
router.put('/:id', validateProjectID, async (req,res) => {
    const { id } = req.params;
    const changes = req.body;

    try{
        const update = Project.update(id, changes)
        if(update) {
            const newProject = await Project.get(id);
            res.status(200).json(newProject)
        }
        else{
            res.status(500).json({error: `error in getting the updated project! `})
        }
    }
    catch(error){
        res.status(500).json({message: `error in updating project`})
    }
})
//DELETE a specific project
router.delete('/:id', validateProjectID, async (req,res) => {
    const {id} = req.params;
    try {
        const removed = await Project.remove(id)
        if(removed){ 
            res.status(204).json({message: `you have successfully deleted the project with ID: ${id}`})
        }
    }
    catch(error){
        res.status(500).json({error: `error in deleting project with an id of: ${id}`})
    }
})

//Middleware to validate Project ID
async function validateProjectID(req,res, next) {
    const { id } = req.params;
    try {
        const project = await Project.get(id)
        if(project) {
            req.project = project
            next();
        }
        else {
            res.status(404).json({ message: "Invalid Project ID" });
        }
    }
    catch(error) {
        res.status(500).json({ message: "There was an error validating that Project." });
    }
}
//Middleware to validate Project post
async function validateProjectPOST(req, res, next) {
    const { name } = req.body;
    const { description } = req.body;

    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Missing Project data." });
    } 
    else if(!name){
        return res.status(400).json({error: `need a NAME for a new project!`});
    }
    
    else if(!description){
        return res.status(400).json({error: `need a DESCRIPTION for a new project!`});
    }

    else if(typeof name !== "string"){
        return res.status(400).json({error: `need STRING for name`});
    }
    else if(typeof description !== "string"){
        return res.status(400).json({error: `need STRING for description`});
    }
    req.body = {name, description}
    next();
}

module.exports = router