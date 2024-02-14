const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = new FormData(this);
    const username = data.get('username');
    const password = data.get('password');

    const response = await fetch("http://localhost:8081/auth/login", {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status !== 200) {
        const errorsP = document.querySelector("#errors");

        errorsP.innerHTML = "L'utilisateur ou le mot de passe incorrect";
        return;
    }

    const json = await response.json();

    localStorage.setItem("accessToken", json.accessToken);

    location.href = "/sounds/list"
});