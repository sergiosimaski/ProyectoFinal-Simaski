

let palmaresDiv = document.getElementById("palmares")

let guardarPalmaresBtn = document.getElementById("guardarPalmaresBtn")
let inputBuscador = document.querySelector("#buscador")
let coincidencia = document.getElementById("coincidencia")
let selectOrden = document.getElementById("selectOrden")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let golesTotal = document.getElementById("golesTotal")
let loaderTexto = document.getElementById("loaderTexto")
let loader = document.getElementById("loader")
let reloj = document.getElementById("reloj")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")

const DateTime = luxon.DateTime
const fechaHoy = DateTime.now()
let fecha = document.getElementById("fecha")
let fechaMostrar = fechaHoy.toLocaleString(DateTime.DateTime_MED_WITH_WEEKDAY)
fecha.innerHTML = `${fechaMostrar}`




let productosEnCarrito
if(localStorage.getItem("carrito")){
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"))
}else{
    productosEnCarrito = []
    localStorage.setItem("carrito", productosEnCarrito)
}


function verCatalogo(array){
    
    palmaresDiv.innerHTML = ""

    for(let palmares of array){
    
        let nuevoPalmaresDiv = document.createElement("div")
        nuevoPalmaresDiv.className = "col-12 col-md-6 col-lg-4 my-3"
        nuevoPalmaresDiv.innerHTML = `
        <div id="${palmares.id}" class="card" style="width: 18rem;">
            <img class="card-img-top img-fluid" style="height: 200px;"src="${palmares.imagen}" alt="${palmares.club} de ${palmares.goleador}">
            <div class="card-body">
                <h4 class="card-title">${palmares.club}</h4>
                <p>Autor: ${palmares.goleador}</p>
                <p class="">Goles: ${palmares.goles}</p>
                <button id="agregarBtn${palmares.id}" class="btn btn-outline-success">Agregar al carrito</button>
            </div>
        </div> 
        `
        palmaresDiv.appendChild(nuevoPalmaresDiv)
        let agregarBtn = document.getElementById(`agregarBtn${palmares.id}`)
        //console.log(agregarBtn)
        
        agregarBtn.onclick = ()=>{
            
            agregarAlCarrito(palmares)
        }
    }
}

function compraTotal(array){
   
    // let acumulador = 0
    // for(let book of array){
    //     acumulador = acumulador + book.goles
    // }
    let total = array.reduce((acc , productoCarrito)=> acc + productoCarrito.goles ,0)
   // console.log("Acc con reduce" + total)
    total === 0 ?
    golesTotal.innerHMTL = `No hay productos agregados` :
    golesTotal.innerHTML = `Los goles necesarios para hacer el canje de EXPERIENCIA GOL son <strong>${total}</strong>`
    return total
}
function finalizarComprar(array){
    Swal.fire({
        title: 'Está seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then( (result)=> {
            if(result.isConfirmed){
                let totalFinalizar = compraTotal(array)
                Swal.fire({
                    title: 'Compra realizada',
                    icon: 'success',
                    confirmButtonColor: 'green',
                    text: `Muchas gracias por su compra ha adquirido la Experiencia Gol. Por un total de ${totalFinalizar}`,
                    })
                //nivel array
                productosEnCarrito = []
                localStorage.removeItem("carrito")    
                
            }else{
                Swal.fire({
                    title: 'Compra no realizada',
                    icon: 'info',
                    text: `La compra no ha sido realizada! Atención sus productos siguen en el carrito :D`,
                    confirmButtonColor: 'green',
                    timer:3500
                })
            }
    })


}

function cargarProductosCarrito(array){
    console.log("Funciona btn render carrito")
    modalBodyCarrito.innerHTML = ""
    array.forEach((productoCarrito)=>{
        
        modalBodyCarrito.innerHTML += `
        <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
            <img class="card-img-top" height="300px" src="${productoCarrito.imagen}" alt="${productoCarrito.club}">
            <div class="card-body">
                    <h4 class="card-title">${productoCarrito.club}</h4>
                
                    <p class="card-text">$${productoCarrito.goles}</p> 
                    <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
            </div>    
        </div>
        `
        })

        array.forEach((productoCarrito)=>{
            document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click" , ()=>{
            let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cardProducto.remove()
            let productoEliminar = array.find(palmares => palmares.id = productoCarrito.id)
            let seccion = array.indexOf(productoEliminar)
            
            array.splice(seccion , 1)
            localStorage.setItem("carrito" , JSON.stringify(array))
            compraTotal(array)

            })
        })
    compraTotal(array)
}

function agregarAlCarrito(palmares){
    console.log(palmares)
    
    let palmaresAgregado = productosEnCarrito.find((elem)=> elem.id == palmares.id)
    if(palmaresAgregado == undefined){
        console.log(`El club ${palmares.club} de ${palmares.goleador} ha sido agregado al carrito y vale cantidad de goles ${palmares.goles}`)
        
        productosEnCarrito.push(palmares)
        
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))

        Swal.fire({
            title: `Agregado al carrito`,
            text: `${palmares.goleador} del club ${palmares.club} ha sido agregado`,
            icon: `success`,
            confirmButtonText: `Gracias`,
            confirmButtonColor: `green`,
            timer: `3000`,

        
        })
        
     

    }else{
       
        console.log(`El club ${palmares.club} de ${palmares.goleador} ya se encuentra en el carrito`)
        Swal.fire({
            text: `Ya existe en el carrito`,
            icon: `info`,
            timer: 1500,
            showConfirmButton: false


        })
    }

}



function cargarPalmares(array){
    let inputGoleador = document.getElementById("goleadorInput")
    let inputClub = document.getElementById("clubInput")
    let inputGoles = document.getElementById("golesInput")
    
   
    const nuevoPalmares = new Palmares(array.length+1, inputGoleador.value, inputClub.value,parseInt(inputGoles.value), "nuevojugador.jpg")
    console.log(nuevoPalmares)
 
    
    array.push(nuevoPalmares)
    
    localStorage.setItem("estanteria", JSON.stringify(array))
    verCatalogo(array)
    let formAgregarPalmares = document.getElementById("formAgregarPalmares")
    
    formAgregarPalmares.reset()
 }


function buscarInfo(buscado, array){
        
    let busquedaArray = array.filter(
            (palmares) => palmares.goleador.toLowerCase().includes(buscado.toLowerCase()) || palmares.club.toLowerCase().includes(buscado.toLowerCase())
        )
    if(busquedaArray.length == 0){
        coincidencia.innerHTML = `<h3>No hay coincidencias con su búsqueda</h3>`
        verCatalogo(busquedaArray)
    }else{
        coincidencia.innerHTML = ""
        verCatalogo(busquedaArray)
    }
}


function ordenarMenorMayor(array){
    
    const menorMayor = [].concat(array)
    menorMayor.sort((param1, param2)=> param1.goles - param2.goles)
    verCatalogo(menorMayor)
}

function ordenarMayorMenor(array){
   
    const mayorMenor = [].concat(array)
    mayorMenor.sort((a,b)=> b.goles - a.goles)
    verCatalogo(mayorMenor)
    
}

function ordenarAlfabeticamenteClub(array){
        const ordenadoAlfabeticamente = [].concat(array)
        
        ordenadoAlfabeticamente.sort((a, b) => {
            if (a.club > b.club) {
              return 1
            }
            if (a.club < b.club) {
              return -1
            }
           
            return 0
          })
          verCatalogo(ordenadoAlfabeticamente)
}


 
guardarPalmaresBtn.addEventListener("click", ()=>{
    cargarPalmares(estanteria)
})

inputBuscador.addEventListener("input", ()=>{
    buscarInfo(inputBuscador.value, estanteria)
})

selectOrden.addEventListener("change", ()=>{
    
    if(selectOrden.value == "1"){
        ordenarMayorMenor(estanteria)
    }else if(selectOrden.value =="2"){
        ordenarMenorMayor(estanteria)
    }else if(selectOrden.value == "3"){
        ordenarAlfabeticamenteClub(estanteria)
    }else{
        verCatalogo(estanteria)
    }
})
botonCarrito.addEventListener("click", ()=>{
    cargarProductosCarrito(productosEnCarrito)
})

botonFinalizarCompra.addEventListener("click", ()=>{

    finalizarComprar(productosEnCarrito)

})

setTimeout(()=>{
    loaderTexto.innerText = ""
    loader.remove()
    
    verCatalogo(estanteria)
    
}, 3000 )
setInterval(()=>{
    
    let horaActual = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS)
    reloj.innerHTML = `${horaActual}`


}, 1000)



  Toastify({
    text: "Bienvenidos Fanáticos del Fútbol",
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function(){} // Callback after click
  }).showToast();

  