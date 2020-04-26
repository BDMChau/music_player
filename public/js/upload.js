document.addEventListener("DOMContentLoaded", function () {

    document.querySelector('form input').addEventListener('change', function () {
        if (this.files.length > 3) {
            alert('You can select only 3 files at once!')
        } else {
            document.querySelector('form p').innerHTML = this.files.length + " file(s) selected";
        }
    });

    document.querySelector('form input').addEventListener('change', function () {
        document.querySelector('.btn-Submit').addEventListener('click', function () {
            if (this.files.length > 3) {
                alert('You can select only 3 files at once!')
            } else {
                document.querySelector('.btn-Submit').innerHTML = 'Processing...';
            }
        })
    })

    // remove 
    document.querySelector('.btn-Remove').addEventListener('click', function () {
        let xhttp = new XMLHttpRequest();

        xhttp.open("DELETE", "/", true);
        xhttp.send();
    })
})