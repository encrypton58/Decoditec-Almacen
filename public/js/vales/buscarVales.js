let vales = []
let tipoV = ""

document.getElementById('table').addEventListener('change', (value) => {
    if (value.target.value == "v2") {
        let list = document.getElementsByClassName('v1')
        for (let item of list) {
            item.classList.remove('show')
            item.classList.add('hide')
        }
        let list2 = document.getElementsByClassName('v2')
        for (let item of list2) {
            item.classList.remove('hide')
            item.classList.add('show')
        }
    } else {
        let list = document.getElementsByClassName('v1')
        for (let item of list) {
            item.classList.remove('hide')
            item.classList.add('show')
        }

        let list2 = document.getElementsByClassName('v2')
        for (let item of list2) {
            item.classList.remove('show')
            item.classList.add('hide')
        }
    }
})

function buscarVales() {

    tipoV = document.getElementById("tvl").value
    let filtro1 = document.getElementById("f1").value
    let filtro2 = document.getElementById("f2").value
    let palabraClave1 = document.getElementById('pc1').value
    let palabraClave2 = document.getElementById('pc2').value
    let versionDeTabla = document.getElementById('table').value

    if (tipoV != "some" && filtro1 != "Some" && palabraClave1 != '' && versionDeTabla != "some") {
        document.getElementById("load").classList.remove('loading-hidden')
        document.getElementById("load").classList.add('loading')
        document.getElementById('mostrarVS').innerHTML = ''

        vales = []
        fetch(`/vales/search?f1=${filtro1}&plc1=${palabraClave1}&f2=${filtro2}&plc2=${palabraClave2}&tdv=${tipoV}&version=${versionDeTabla}&plataform=web`, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {

            response.json().then((res) => {
                console.log(res);
                if (res.length == 0) {
                    swal("No Se Encontro Informacion", "", "warning")
                } else {
                    if (versionDeTabla == "v1") {
                        res.forEach((vs) => {
                            vales.push(vs)
                            document.getElementById('mostrarVS').appendChild(mostrarEnTabla(vs))
                        })
                    } else {
                        res.forEach((vs) => {
                            vales.push(vs)
                            document.getElementById('mostrarVS').appendChild(mostrarEnTablaV2(vs))
                        })
                    }
                }
                document.getElementById("load").classList.remove('loading')
                document.getElementById("load").classList.add('loading-hidden')
            })
        })

    } else {
        swal("Rellena los Campos Para Realizar La busqueda", "", "info")
    }

}

async function imprimirVales() {
    if (vales.length != 0) {
        let tipoDeVale = ((tipoV == "vales_de_entradas") ? "Vales De Entrada" : "Vales De Salida")
        let request = await fetch("/vales/imprimir?plataform=web", { method: "POST", headers: { "Content-Type": "Application/json" }, body: JSON.stringify({ vales: vales, tdv: tipoDeVale }) })
        window.open(request.url, '_blank')
    } else {
        swal("No Hay Datos Para Imprimir", "Realiza una busqueda e intenta de nuevo", "info")
    }

}

function mostrarEnTablaV2(vs) {
    let trVale = document.createElement('tr')
    let tdFolio = document.createElement('td')
    tdFolio.textContent = vs.noFolio
    let tdNombre = document.createElement('td')
    tdNombre.textContent = vs.nombre
    let tdFecha = document.createElement('td')
    tdFecha.textContent = vs.fecha.split('T')[0]

    let tdMateriales = document.createElement('td')

    let materiales = JSON.parse(vs.materiales)
    console.log(materiales);
    materiales.forEach((material, index) => {
        if (index % 2 == 0) {
            tdMateriales.innerHTML += `<b>${material.cantidad} &nbsp;| ${material.material} &nbsp;| ${material.observacion}</b><br>`
        } else {
            tdMateriales.innerHTML += `${material.cantidad} &nbsp;| ${material.material} &nbsp;| ${material.observacion} <br>`
        }


    })


    let tdProyecto = document.createElement('td')
    tdProyecto.textContent = vs.proyecto
    let tdRecibio = document.createElement('td')
    tdRecibio.textContent = vs.recibio
    let tdEntrego = document.createElement('td')
    tdEntrego.textContent = vs.entrego

    let tdObservacionVale = document.createElement('td')
    tdObservacionVale.innerText = vs.obserVale

    trVale.appendChild(tdFolio)
    trVale.appendChild(tdNombre)
    trVale.appendChild(tdFecha)
    trVale.appendChild(tdMateriales)
    trVale.appendChild(tdProyecto)
    trVale.appendChild(tdRecibio)
    trVale.appendChild(tdEntrego)
    trVale.appendChild(tdObservacionVale)

    return trVale

}

function mostrarEnTabla(vs) {
    let trVale = document.createElement('tr')
    let tdFolio = document.createElement('td')
    tdFolio.textContent = vs.noFolio
    let tdNombre = document.createElement('td')
    tdNombre.textContent = vs.nombre
    let tdFecha = document.createElement('td')
    tdFecha.textContent = vs.fecha
    let tdCantidad = document.createElement('td')
    tdCantidad.classList.add('text-center')
    tdCantidad.textContent = vs.cantidad
    let tdMaterial = document.createElement('td')
    tdMaterial.textContent = vs.material
    let tdProyecto = document.createElement('td')
    tdProyecto.textContent = vs.proyecto
    let tdRecibio = document.createElement('td')
    tdRecibio.textContent = vs.recibio
    let tdEntrego = document.createElement('td')
    tdEntrego.textContent = vs.entrego
    let tdObsevaciones = document.createElement('td')
    tdObsevaciones.textContent = vs.obsevaciones

    trVale.appendChild(tdFolio)
    trVale.appendChild(tdNombre)
    trVale.appendChild(tdFecha)
    trVale.appendChild(tdCantidad)
    trVale.appendChild(tdMaterial)
    trVale.appendChild(tdProyecto)
    trVale.appendChild(tdRecibio)
    trVale.appendChild(tdEntrego)
    trVale.appendChild(tdObsevaciones)

    return trVale
}