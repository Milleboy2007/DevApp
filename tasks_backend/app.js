import express from 'express';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CREATE
app.post('/task', async (req, res) => {
    try{
        const {title} = req.body;
        const [result] = await pool.query("INSERT INTO tasks (title) VALUES (?)", [title]);

        res.status(201).json({id: result.insertId, title});
    }catch(e){
        res.status(500).json({erreur: 'Erreur serveur'});
    }
});

// READ (Tous)
app.get('/tasks', async (req, res) => {
    try{
        const [result] = await pool.query("SELECT * FROM tasks");
        res.json(result);
    }catch(e){
        res.status(500).json({erreur: 'Erreur serveur'});
    }
});

// READ (Un seul)
app.get('/tasks/:id', async (req, res) => {
    try{
        const [result] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        if(result.length === 0) return res.status(404).json({erreur: "Not Found"});
        res.json(result[0])
    }catch(e){
        res.status(500).json({erreur: 'Erreur serveur'});
    }
});

// DELETE
app.delete('/tasks/:id', async (req, res) => {
    try{
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
        if(result.affectedRows === 0) return res.status(404).json({erreur: "Not Found"});
        res.json({message: "Supprime avec succes!"});
    }catch(e){
        res.status(500).json({erreur: 'Erreur serveur'});
    }
});

// Lorsqu'une erreur se produit dans l'application (par exemple, une exception non gérée), Express appelle automatiquement
// ce middleware d'erreur avec l'objet d'erreur (err), ce qui permet de la gérer de manière centralisée et uniforme.
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(1045).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});