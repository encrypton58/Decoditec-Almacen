let noInputs = 1

async function registrarVales() {

    let nombre = document.getElementById("nombre").value
    let folio = document.getElementById("folio").value
    let fecha = document.getElementById("fecha").value
    let proyecto = document.getElementById("proyecto").value
    let recibio = document.getElementById("recibio").value
    let entrego = document.getElementById("entrego").value
    let obserVale = document.getElementById('obserVale').value
    let tdv = document.getElementById("tdv").value

    let materiales = []

    for (let i = 0; i < noInputs; i++) {
        let mate = document.getElementById("mate" + i).value
        let cant = document.getElementById("cant" + i).value
        let obse = document.getElementById("obse" + i).value
        materiales.push({
            cantidad: cant,
            material: mate,
            observacion: obse
        })
    }

    let vale = new Vale(folio, nombre, fecha, proyecto, recibio, entrego, materiales, obserVale, tdv)

    if (nombre && folio && fecha && proyecto && recibio && entrego && tdv && materiales.length > 0) {
        let request = await fetch('/vales/register', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vale) })
        let json = await request.json()
        if (json.msg) {
            swal("Registrado Con Exito", "", "success").then(() => {
                window.location.reload()
            })
        } else {
            swal("Ocurrion Un Error En El Registro", "", "error")
        }
    } else {
        swal("Hacen Falta Campos Por llenar", "", "info")
    }


}

function agregarInput() {
    let br = document.createElement('br')
    let divRow = document.createElement('div')
    divRow.classList.add('row')
    let div1 = document.createElement('div')
    div1.classList.add('col-md-2')
    let inputCantidad = document.createElement('input')
    inputCantidad.setAttribute('type', 'number')
    inputCantidad.setAttribute('placeholder', 'Cantidad')
    inputCantidad.setAttribute('id', 'cant' + noInputs)
    inputCantidad.classList.add('form-control')
    let div2 = document.createElement('div')
    div2.classList.add("col-md-6")
    let inputMaterial = document.createElement('input')
    inputMaterial.setAttribute('type', 'text')
    inputMaterial.setAttribute('placeholder', 'Material')
    inputMaterial.setAttribute('id', "mate" + noInputs)
    let div3 = document.createElement('div')
    div3.classList.add("col-md-4")
    let inputObse = document.createElement('input')
    inputObse.setAttribute('type', 'text')
    inputObse.setAttribute('placeholder', 'Observacion de Material')
    inputObse.setAttribute('id', "obse" + noInputs)
    inputObse.classList.add('form-control')
    inputMaterial.classList.add('form-control')

    div1.appendChild(inputCantidad)
    div2.appendChild(inputMaterial)
    div3.appendChild(inputObse)
    divRow.appendChild(div1)
    divRow.appendChild(div2)
    divRow.appendChild(div3)
    document.getElementById("newIn").appendChild(br)
    document.getElementById("newIn").appendChild(divRow)
    document.getElementById("newIn").appendChild(br)
    noInputs++
}

function Vale(noFolio, nombre, fecha, proyecto, recibio, entrego, materiales, obserVale, tdv) {
    this.noFolio = noFolio
    this.nombre = nombre
    this.fecha = fecha
    this.proyecto = proyecto
    this.recibio = recibio
    this.entrego = entrego
    this.materiales = materiales
    this.obserVale = obserVale
    this.tdv = tdv
}