
class Palmares {
    constructor(id, goleador, club, goles, imagen){
        
        this.id = id,
        this.goleador = goleador,
        this.club = club,
        this.goles = goles, 
        this.imagen = imagen
        this.cantidad = 1


       
    }
  
    mostrarInfoPalmares(){
        console.log(`El club es ${this.club}, el goleador es ${this.goleador} y sus goles son ${this.goles}`)
    }
    sumarUnidad(){
        this.cantidad += 1
    }
    restarUnidad(){
        this.cantidad += 1
    }
    
   
}

let estanteria = []

const cargarEstanteria = async () =>{
   
    const response = await fetch("palmares.json")
    const data = await response.json()
    for (let palmares of data){
        let palmaresNuevo = new Palmares(palmares.id , palmares.goleador, palmares.club , palmares.goles , palmares.imagen)
        estanteria.push(palmaresNuevo)
    }
    console.log(estanteria)
    localStorage.setItem("estanteria", JSON.stringify(estanteria))
}

if(localStorage.getItem("estanteria")){
    
    for (let palmares of JSON.parse(localStorage.getItem("estanteria"))){
        let palmaresStorage = new Palmares(palmares.id , palmares.goleador, palmares.club , palmares.goles , palmares.imagen)
        estanteria.push(palmaresStorage)
    }
    
    console.log(estanteria)
    
    
}else{
    
    console.log("Seteamos por primera vez, entra sólo en la primera vez")
    
    cargarEstanteria()
}
