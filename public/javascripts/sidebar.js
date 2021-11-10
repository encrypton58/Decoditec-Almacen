let ancla = document.getElementById('editLink')

if (window.sessionStorage.getItem('pagination')) {
    ancla.setAttribute('href', '/vales/editar?pagination=' + parseInt(window.sessionStorage.getItem('pagination')))
}