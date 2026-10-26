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


export default function calculer_masse_promise(){
    try{
        fetchLongueur().then(res => {
            let masse = res
            fetchLargeur().then(res => {
                masse *= res
                fetchProfondeur().then(res => {
                    masse *= res
                    fetchMasseVolumique().then(res => {
                        masse *= res
                        console.log('Promise: ' + masse)
                    })
                })
            })
        })
    }catch(e){
        console.error(e)
    }
}