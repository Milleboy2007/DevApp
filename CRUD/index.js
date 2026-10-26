import pool from "./database.js"
import calculer_masse_promise from "./promise.js"
import calculer_masse_async from "./async.js"

function draw(message, sorti){
    console.log(`${message}`)
    console.table(sorti)
}

async function test_bd(){
    const [resultat] = await pool.query("SELECT * FROM etudiant")
    draw('test db:',resultat)
}

async function parc_attraction_exo(){
    const [resultat_parc] = await pool.query("SELECT * FROM parc_attraction")
    draw('Avant creation: ', resultat_parc)

    await pool.query("INSERT INTO parc_attraction (nom, ville, cout_billet) VALUES ('Test', 'Montreal', 15), ('Test2', 'Montreal', 15)")

    const [resultat_parc2] = await pool.query("SELECT * FROM parc_attraction")
    draw('Apres creation: ', resultat_parc2)

    await pool.query("DELETE FROM parc_attraction WHERE nom = 'Test' || nom = 'Test2'")

    const [resultat_parc3] = await pool.query("SELECT * FROM parc_attraction")
    draw('Apres suppression: ', resultat_parc3)
}

async function masse_exo(){
    calculer_masse_promise()
    calculer_masse_async()
}

