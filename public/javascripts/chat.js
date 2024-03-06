document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.getElementById("home-btn").addEventListener("click", function() {
        window.location.href = '/';
    });
}