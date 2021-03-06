var url_string = window.location.href
var url = new URL(url_string)
let user = url.searchParams.get("user")
let correo = url.searchParams.get("email")

if (user == 1 && correo != undefined) {
    swal("Registrado", "El Usuario se registro correctamente espera a ser aceptado por el administrador", "success")
    document.getElementById('inputEmail').value = correo;
}

if (url.searchParams.get('err') == "noFound") {
    swal("No se Encontro El usuario", "No se han encontrado coicidencias de tu usuario", "warning")
}
if (url.searchParams.get('err') == "PasswordIncorrect") {
    document.getElementById('inputEmail').value = correo;
    swal("La contraseña es incorrecta", "Verifica tu contraseña", "error")
}
if (url.searchParams.get('err') == "NoDataFull") {
    swal("Faltan Datos", "Escribe Todos los datos que se piden", "error")
}
if (url.searchParams.get('err') == "noSessionToken") {
    swal("Inicia Sesion", "Debes Iniciar Sesion para continuar", "warning")
}
if (url.searchParams.get('err') == "tokenInvalid") {
    swal("Inicia Sesion", "Se ha cerrado esa sesion vuelve a iniciar sesion", "error")
}
var myUrlClean = "";
window.history.pushState({}, document.title, "/" + myUrlClean);