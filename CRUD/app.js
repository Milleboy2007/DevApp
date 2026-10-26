import express from 'express';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CREATE
app.post('/parcs', async (req, res) => {
    try {
        const { nom, ville, cout_billet } = req.body;
        const [result] = await pool.query(
            "INSERT INTO parc_attraction (nom, ville, cout_billet) VALUES (?, ?, ?)",
            [nom, ville, cout_billet]
        );
        res.status(201).json({ id: result.insertId, nom, ville, cout_billet });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// READ (Tous)
app.get('/parcs', async (req, res) => {
    try {
        const [parcs] = await pool.query("SELECT * FROM parc_attraction");
        res.json(parcs);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// READ (Un seul)
app.get('/parcs/:id', async (req, res) => {
    try {
        const [parcs] = await pool.query("SELECT * FROM parc_attraction WHERE id = ?", [req.params.id]);
        if (parcs.length === 0) return res.status(404).json({ erreur: "Non trouvé" });
        res.json(parcs[0]);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// UPDATE
app.put('/parcs/:id', async (req, res) => {
    try {
        const { nom, ville, cout_billet } = req.body;
        const [result] = await pool.query(
            "UPDATE parc_attraction SET nom = ?, ville = ?, cout_billet = ? WHERE id = ?",
            [nom, ville, cout_billet, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ erreur: "Non trouvé" });
        res.json({ message: "Mis à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// DELETE
app.delete('/parcs/:id', async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM parc_attraction WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ erreur: "Non trouvé" });
        res.json({ message: "Supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
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