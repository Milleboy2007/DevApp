async function fetchLongueur(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2)
        }, 1000)
    })
}

async function fetchLargeur(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(1)
        }, 1000)
    })
}

async function fetchProfondeur(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(4)
        }, 1000)
    })
}

async function fetchMasseVolumique(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(5)
        }, 1000)
    })
}

export default async function calculer_masse_async(){
    try{
        const fetchLargeur_promise = fetchLargeur()
        const fetchLongueur_promise = fetchLongueur()
        const fetchProfondeur_promise = fetchProfondeur()
        const fetchMasseVolumique_promise = fetchMasseVolumique()
    
        const [largeur, longueur, profondeur, masseVolumique] = await Promise.all([fetchLargeur_promise, fetchLongueur_promise, fetchProfondeur_promise, fetchMasseVolumique_promise])
    
        console.log('Async: ' + (longueur * largeur * profondeur * masseVolumique))
    }catch(e){
        console.error(e)
    }
}