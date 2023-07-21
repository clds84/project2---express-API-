let d = new Date().toDateString();
let c = new Date();
var comments = document.querySelectorAll('.time')

for (let comment of comments) {
    comment.innerHTML = d + ' @ ' + c.getHours() + ':' + c.getMinutes() 

}

