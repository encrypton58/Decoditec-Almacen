const btns = document.querySelectorAll('button')

btns.forEach(btn => btn.addEventListener('click', () => {
    swal("Esta función se habilitara proximamente", "", "info")
}))