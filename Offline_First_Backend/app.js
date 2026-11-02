import express from 'express';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Fonction pour initialiser la base de données (Création de la table si elle n'existe pas)
async function initializeDatabase() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                updated_at DATETIME NOT NULL
            );
        `;
        await pool.query(query);
        console.log("✅ Table 'tasks' vérifiée / créée avec succès.");
    } catch (error) {
        console.error("❌ Erreur lors de la création de la table :", error);
    }
}

app.post('/tasks', async (req, res) => {
    try {
        const { title, updated_at } = req.body;
        
        // Convertit la date au format string compatible MySQL
        const dateToSave = updated_at 
            ? new Date(updated_at).toISOString().slice(0, 19).replace('T', ' ')
            : new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await pool.query(
            "INSERT INTO tasks (title, updated_at) VALUES (?, ?)",
            [title, dateToSave]
        );
        
        res.status(201).json({ id: result.insertId, title, updated_at: dateToSave });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// READ (Tous - avec filtrage intelligent via lastSync optionnel)
app.get('/tasks', async (req, res) => {
    try {
        const { lastSync } = req.query;
        let query = "SELECT * FROM tasks";
        let params = [];

        // Si le client fournit une date de dernière synchro, on ne renvoie que ce qui a changé depuis
        if (lastSync) {
            query += " WHERE updated_at >= ?";
            params.push(lastSync);
        }

        const [tasks] = await pool.query(query, params);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// READ (Un seul)
app.get('/tasks/:id', async (req, res) => {
    try {
        const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
        if (tasks.length === 0) return res.status(404).json({ erreur: "Non trouvé" });
        res.json(tasks[0]);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// UPDATE
app.put('/tasks/:id', async (req, res) => {
    try {
        const { title, updated_at } = req.body;
        const [result] = await pool.query(
            "UPDATE tasks SET title = ?, updated_at = ? WHERE id = ?",
            [title, updated_at || new Date(), req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ erreur: "Non trouvé" });
        res.json({ message: "Mis à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// DELETE
app.delete('/tasks/:id', async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ erreur: "Non trouvé" });
        res.json({ message: "Supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
});

// Middleware d'erreur centralisé
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Lancement de l'initialisation de la DB puis démarrage du serveur
initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });
});