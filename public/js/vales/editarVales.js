let sizeArrayMaterialEdit = 0;

document.getElementById("vTable").addEventListener('change', (event) => {
    if (event.target.value == "v2") {
        document.getElementById('mostrarVS').classList.add("hide")
        document.getElementById('mostrarV2').classList.remove("hide")
        document.getElementById('pagination').classList.add("hide")
        document.getElementById('pagination').classList.remove("showPagination")
        let list = document.getElementsByClassName('v1')
        for (let item of list) {
            item.classList.remove('show')
            item.classList.add('hide')
        }
        let list2 = document.getElementsByClassName('v2')
        for (let item of list2) {
            item.classList.remove('hide')
            if (item.classList.contains('row')) {
                item.classList.add('showRow')
            } else {
                item.classList.add('show')
            }

        }
    } else {
        document.getElementById('pagination').classList.remove("hide")
        document.getElementById('mostrarV2').classList.add("hide")
        document.getElementById('pagination').classList.add("showPagination")
        document.getElementById('mostrarVS').classList.remove("hide")
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
    document.getElementById("pagination").innerHTML = ''
    tipoV = document.getElementById("tvl").value
    let filtro1 = document.getElementById("f1").value
    let filtro2 = document.getElementById("f2").value
    let palabraClave1 = document.getElementById('pc1').value
    let palabraClave2 = document.getElementById('pc2').value
    let tableVersion = document.getElementById('vTable').value

    if (tipoV != "some" && filtro1 != "Some" && palabraClave1 != '' && tableVersion != "some") {
        document.getElementById("load").classList.remove('loading-hidden')
        document.getElementById("load").classList.add('loading')
        document.getElementById('mostrarVS').innerHTML = ''


        vales = []
        fetch(`/vales/search?f1=${filtro1}&plc1=${palabraClave1}&f2=${filtro2}&plc2=${palabraClave2}&tdv=${tipoV}&version=${tableVersion}`, {
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
                    if (tableVersion == "v1") {
                        res.forEach((vs) => {
                            vales.push(vs)
                            document.getElementById('mostrarVS').appendChild(mostrarEnTabla(vs))
                        })
                    } else {
                        document.getElementById('mostrarV2').innerHTML = ''
                        res.forEach((vs) => {
                            vales.push(vs)

                            document.getElementById('mostrarV2').appendChild(mostrarEnTablaV2(vs))
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
    materiales.forEach((item, index) => {
        if (index % 2 == 0) {
            tdMateriales.innerHTML += `<b>${item.cantidad} &nbsp;| ${item.material} &nbsp;| ${item.observacion}</b><br><hr>`
        } else {
            tdMateriales.innerHTML += `${item.cantidad} &nbsp;| ${item.material} &nbsp;| ${item.observacion} <br><hr>`
        }
    })

    let tdProyecto = document.createElement('td')
    tdProyecto.textContent = vs.proyecto
    let tdRecibio = document.createElement('td')
    tdRecibio.textContent = vs.recibio
    let tdEntrego = document.createElement('td')
    tdEntrego.textContent = vs.entrego
    let tdObsVale = document.createElement('td')
    tdObsVale.innerText = vs.obserVale
    let tdAcciones = document.createElement('td')
    tdAcciones.classList.add('text-center')
    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('type', "button")
    btnDelete.classList.add('btn', 'btn-danger')
    btnDelete.id = vs.noFolio
    btnDelete.onclick = () => {
        eliminarRegistro(btnDelete)
    }
    let iTrash = document.createElement('i')
    iTrash.classList.add('material-icons')
    iTrash.textContent = "delete"
    btnDelete.appendChild(iTrash)
    let btnEdit = document.createElement('button')
    btnEdit.setAttribute('type', 'button')
    btnEdit.classList.add('btn', 'btn-primary')
    btnEdit.id = vs.noFolio
    btnEdit.onclick = () => {
        editarVale(btnEdit)
    }
    let iEdit = document.createElement('i')
    iEdit.classList.add('material-icons')
    iEdit.textContent = "edit_note"
    btnEdit.appendChild(iEdit)

    tdAcciones.appendChild(btnDelete)
    tdAcciones.appendChild(btnEdit)

    trVale.appendChild(tdFolio)
    trVale.appendChild(tdNombre)
    trVale.appendChild(tdFecha)
    trVale.appendChild(tdMateriales)
    trVale.appendChild(tdProyecto)
    trVale.appendChild(tdRecibio)
    trVale.appendChild(tdEntrego)
    trVale.appendChild(tdObsVale)
    trVale.appendChild(tdAcciones)

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
    tdObsevaciones.textContent = vs.observacion
    let tdAcciones = document.createElement('td')
    tdAcciones.classList.add('text-center')
    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('type', "button")
    btnDelete.classList.add('btn', 'btn-danger')
    btnDelete.id = vs.noFolio
    btnDelete.onclick = () => {
        eliminarRegistro(btnDelete)
    }
    let iTrash = document.createElement('i')
    iTrash.classList.add('material-icons')
    iTrash.textContent = "delete"
    btnDelete.appendChild(iTrash)
    let btnEdit = document.createElement('button')
    btnEdit.setAttribute('type', 'button')
    btnEdit.classList.add('btn', 'btn-primary')
    btnEdit.id = vs.noFolio
    btnEdit.onclick = () => {
        editarVale(btnEdit)
    }
    let iEdit = document.createElement('i')
    iEdit.classList.add('material-icons')
    iEdit.textContent = "edit_note"
    btnEdit.appendChild(iEdit)

    tdAcciones.appendChild(btnDelete)
    tdAcciones.appendChild(btnEdit)

    trVale.appendChild(tdFolio)
    trVale.appendChild(tdNombre)
    trVale.appendChild(tdFecha)
    trVale.appendChild(tdCantidad)
    trVale.appendChild(tdMaterial)
    trVale.appendChild(tdProyecto)
    trVale.appendChild(tdRecibio)
    trVale.appendChild(tdEntrego)
    trVale.appendChild(tdObsevaciones)
    trVale.appendChild(tdAcciones)

    return trVale
}

async function eliminarRegistro(self) {

    let folio = self.id

    let material
    let tabla

    if (document.getElementById('vTable').value == "v2") {
        tabla = document.getElementById('tvl').value.substr(0, document.getElementById('tvl').value.length - 1)
        tabla += "_" + document.getElementById('vTable').value
    } else {
        if (document.getElementById('tvl').value == "some") {
            tabla = "vales_de_salidas"
        } else {
            tabla = document.getElementById('tvl').value
        }

        material = self.parentElement.parentElement.childNodes[4].textContent
    }
    let request = await fetch('/vales/delete', {
        method: "DELETE",
        headers: { "Content-Type": "Application/json" },
        body: (tabla == "vales_de_salidas") ? JSON.stringify({
            folio: folio,
            material: material,
            tabla: tabla
        }) : JSON.stringify({ folio, tabla })
    })
    let json = await request.json()
    console.log(json);
    if (json.eliminado && tabla == "vales_de_salidas" || tabla == "vales_de_entradas") {
        swal("Se Elimino Correctamente", "", "success")
        document.getElementById('mostrarVS').removeChild(self.parentElement.parentElement)
    } else if (json.eliminado && tabla == "vales_de_salida_v2" || tabla == "vales_de_entrada_v2") {
        swal("Se Elimino Correctamente", "", "success")
        document.getElementById('mostrarV2').removeChild(self.parentElement.parentElement)
    } else {
        swal("Ocurrio Un Error Al Eliminar", "", "error")
    }


}

async function editarVale(self) {

    let folio = self.id
    let tdv = document.getElementById("tvl").value
    let version = document.getElementById("vTable").value
    let material = self.parentElement.parentElement.childNodes[4].textContent

    let tabla

    if (tdv != "some" && version == "v1") {
        tabla = tdv
    } else if (tdv != "some" && version == "v2") {
        tabla = tdv.substr(0, tdv.length - 1)
        tabla += "_" + version
    } else {
        tabla = "vales_de_salidas"
    }

    let request = await fetch(`/vales/get/table/${tabla}/voucher/${folio}?material=${material}&ver=${version}`, {
        method: "GET",
        headers: { "Content-Type": "Application/json" },
    })

    let json = await request.json()

    if (json.length > 0) {

        if (version == "v2") {
            json.forEach((item) => {
                document.ev.fol.value = item.noFolio
                document.ev.nom.value = item.nombre
                document.ev.fec.setAttribute('type', 'date')
                document.ev.fec.value = item.fecha.split('T')[0]
                document.ev.pro.value = item.proyecto
                document.ev.rec.value = item.recibio
                document.ev.ent.value = item.entrego
                document.ev.obsVale.value = item.obserVale

                let materiales = JSON.parse(item.materiales)
                sizeArrayMaterialEdit = materiales.length
                let div = document.getElementById('materialesForm')
                div.innerHTML = ''
                materiales.forEach((item, index) => {
                    div.innerHTML += `
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group bmd-form-group">
                                        <label for="folio" class="bmd-label-static">Cantidad</label>
                                        <input class="form-control" type="number" id="can${index}" value=${item.cantidad}>
                                    </div>
                                </div>
                            <div class="col-md-4">
                                <div class="form-group bmd-form-group">
                                    <label for="folio" class="bmd-label-static">Material</label>
                                    <input class="form-control" type="text" id="mat${index}" value=${item.material}>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group bmd-form-group">
                                    <label for="folio" class="bmd-label-static">Observacion</label>
                                    <input class="form-control" type="text" id="obs${index}" value=${item.observacion}>
                                </div>
                            </div>
                        </div>`
                })
            })
        } else {
            if (json.length > 0) {
                document.ev.fol.value = json[0].noFolio
                document.ev.nom.value = json[0].nombre
                document.ev.fec.setAttribute('type', 'text')
                document.ev.fec.value = json[0].fecha
                document.ev.pro.value = json[0].proyecto
                document.ev.rec.value = json[0].recibio
                document.ev.ent.value = json[0].entrego
                document.ev.can.value = json[0].cantidad
                document.ev.mat.value = json[0].material
                document.ev.obs.value = json[0].observacion
            }
        }


    } else {
        swal("Error", "Ocurrio un error al tratar de obtener el vale", "error")
    }

    console.log(json);

    $('#editModal').modal()
}

function agregarInputs() {
    let index = sizeArrayMaterialEdit;
    let div = document.getElementById('materialesForm')
    div.innerHTML += `
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group bmd-form-group">
                            <label for="folio" class="bmd-label-static">Cantidad</label>
                            <input class="form-control" type="number" id="can${index}">
                        </div>
                    </div>
                <div class="col-md-4">
                    <div class="form-group bmd-form-group">
                        <label for="folio" class="bmd-label-static">Material</label>
                        <input class="form-control" type="text" id="mat${index}">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group bmd-form-group">
                        <label for="folio" class="bmd-label-static">Observacion</label>
                        <input class="form-control" type="text" id="obs${index}">
                    </div>
                </div>
            </div>`
    sizeArrayMaterialEdit++

}

async function editar() {

    let folio = document.ev.fol.value
    let nombre = document.ev.nom.value
    let fecha = document.ev.fec.value
    let proyecto = document.ev.pro.value
    let recibio = document.ev.rec.value
    let entrego = document.ev.ent.value
    let obserVale = document.ev.obsVale.value

    let materiales = []

    if (document.getElementById('vTable').value == "v1" || document.getElementById('vTable').value == "some") {
        let cantidad = parseInt(document.ev.can.value)
        let material = document.ev.mat.value
        let observacion = document.ev.obs.value
        materiales.push({ cantidad, material, observacion })
    } else {
        for (let index = 0; index < sizeArrayMaterialEdit; index++) {
            let cantidad = document.getElementById("can" + index).value
            let material = document.getElementById("mat" + index).value
            let observacion = document.getElementById("obs" + index).value
            materiales.push({
                cantidad,
                material,
                observacion
            })
        }
    }

    let tdv = document.getElementById("tvl").value
    let ver = document.getElementById('vTable').value
    let tmp = ((tdv != "some") ? tdv : "vales_de_salidas")

    let tabla

    if (ver == "v2") {
        tabla = tmp.substr(0, tmp.length - 1)
        tabla += "_" + ver
    } else {
        tabla = tmp
    }

    let valeEdit

    if (ver == "v1") {
        valeEdit = new Vale(folio, nombre, fecha, proyecto, recibio, entrego, materiales, tabla)
    } else {
        valeEdit = {
            noFolio: folio,
            nombre,
            fecha,
            proyecto,
            recibio,
            entrego,
            materiales,
            obserVale
        }
    }

    let request = await fetch('/vales/edit/' + valeEdit.noFolio, {
        method: "PUT",
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify({ vale: valeEdit, tabla })
    })
    let json = await request.json()
    console.log(json)
    if (json.editado) {
        swal("Editado Correctamente", "", "success").then(() => {
            window.location.reload()
        })
        $('#editModal').modal('toggle')
    } else {
        swal("Ocurrio un error al editar", "", "error")
    }

}

crearPaginados()

let pageSize = 50

async function crearPaginados() {
    let ss = window.sessionStorage
    let paginadorUl = document.getElementById("pagination")
    let index
    let currentPage
    let startPage
    let endPage
    let pagination
    let noRegistros

    let request = await fetch('/vales/size', {
        method: "GET",
        headers: { "Content-Type": "Application/json" }
    })

    let json = await request.json()

    noRegistros = json[0].registros
    let noPages = [];
    let pagesShow = 17

    if (ss.getItem('currentPage')) {
        currentPage = ss.getItem('currentPage')
    } else {
        currentPage = 0
        ss.setItem('currentPage', currentPage)
    }
    if (ss.getItem('index')) {
        index = parseInt(ss.getItem('index'))
    } else {
        index = 0
        ss.setItem('index', index)
    }
    if (ss.getItem('startPage')) {
        startPage = parseInt(ss.getItem('startPage'))
    } else {
        startPage = 0
    }
    if (ss.getItem('endPage')) {
        endPage = parseInt(ss.getItem('endPage'))
    } else {
        endPage = 0
    }
    if (ss.getItem('pagination')) {
        pagination = parseInt(ss.getItem('pagination'))
    } else {
        pagination = 0
        pagination = ss.setItem('pagination', pagination)
    }
    let tmp = 0
    let to = 0

    while (tmp <= noRegistros) {
        tmp = tmp + pageSize
        noPages.push({
            to,
            for: tmp
        })
        to = tmp
    }

    if (currentPage == endPage) {
        startPage = endPage
        endPage = endPage + pagesShow
    }

    let tmp2 = 0
    for (let i = startPage; i <= endPage; i++) {
        let li = document.createElement('li')
        let a = document.createElement('a')
        tmp2 = noPages[i].for
        a.setAttribute('href', '/vales/editar?pagination=' + tmp2)
        li.id = i + 1
        li.onclick = () => {
            ss.setItem('index', li.id.toString())
            currentPage = li.id - 1
            pagination = a.href.split('=')[1]
            ss.setItem('pagination', pagination)
            ss.setItem('currentPage', currentPage.toString())
        }
        a.textContent = i + 1
        li.appendChild(a)
        paginadorUl.appendChild(li)
    }

    ss.setItem('startPage', startPage.toString())
    ss.setItem('endPage', endPage.toString())

    if (index > 1)
        crearArrowPaginacion("left", false, paginadorUl, document.getElementById(index.toString()).childNodes[0].href)
    else
        crearArrowPaginacion("left", true, paginadorUl, "")

    crearArrowPaginacion("right", false, paginadorUl, document.getElementById((index === 0) ? "1" : (index).toString()).childNodes[0].href)

    if (index != 0) {
        document.getElementById(index.toString()).classList.add('active')
    }


}


function crearArrowPaginacion(leftOrRight, disabled, paginadorUl, href) {
    let indexGet = parseInt(window.sessionStorage.getItem('index'))
    let leftArr = document.createElement('li')
    leftArr.classList.add((disabled) ? 'disabled' : "enabled")
    let aLA = document.createElement('a')
    if (leftOrRight == "right") {
        let number = parseInt(href.split("=")[1]) + ((indexGet == 0) ? 0 : pageSize)
        console.log(href.split("=")[1]);
        aLA.setAttribute('href', href.split("=")[0] + "=" + number)
        aLA.onclick = () => {

            let currentPage = parseInt(window.sessionStorage.getItem('currentPage'))
            if (currentPage == 0 && indexGet == 0) {
                currentPage = 0
            } else {
                currentPage = currentPage + 1
            }
            let pagination = number
            window.sessionStorage.setItem('pagination', pagination)
            indexGet = indexGet + 1
            window.sessionStorage.setItem('index', indexGet)
            window.sessionStorage.setItem('currentPage', currentPage)
        }
        aLA.setAttribute('target', "_self")
    } else if (leftOrRight == "left") {
        if (indexGet > 1) {
            let number = parseInt(href.split("=")[1]) - ((indexGet == 0) ? 0 : pageSize)
            aLA.setAttribute('href', href.split("=")[0] + "=" + number)
            aLA.onclick = () => {
                let currentPage = parseInt(window.sessionStorage.getItem('currentPage'))
                currentPage = currentPage - 1
                indexGet = indexGet - 1
                let pagination = number
                window.sessionStorage.setItem('pagination', pagination)
                window.sessionStorage.setItem('index', indexGet)
                window.sessionStorage.setItem('currentPage', currentPage)
            }

        }
    }

    let iLA = document.createElement('i')
    iLA.classList.add('material-icons')
    iLA.textContent = "chevron_" + leftOrRight
    aLA.appendChild(iLA)
    leftArr.appendChild(aLA)
    if (leftOrRight == "left") {
        paginadorUl.insertAdjacentElement("afterBegin", leftArr)
    } else {
        paginadorUl.appendChild(leftArr)
    }

}

function Vale(noFolio, nombre, fecha, proyecto, recibio, entrego, materiales, tdv) {
    this.noFolio = noFolio
    this.nombre = nombre
    this.fecha = fecha
    this.proyecto = proyecto
    this.recibio = recibio
    this.entrego = entrego
    this.materiales = materiales
    this.tdv = tdv
}