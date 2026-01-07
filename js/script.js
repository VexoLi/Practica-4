const STORAGE_KEY = "tasquesKanban";

function carregarTasques() {
    const dades = localStorage.getItem(STORAGE_KEY);
    return dades ? JSON.parse(dades) : [];
}

function guardarTasques(tasques) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasques));
}

let tasques = carregarTasques();
let tascaEditantId = null;

const form = document.getElementById("tasca-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titol = document.getElementById("titol").value.trim();
    const descripcio = document.getElementById("descripcio").value;
    const prioritat = document.getElementById("prioritat").value;
    const estat = document.getElementById("estat").value;
    const dataVenciment = document.getElementById("data").value;

    if (titol === "") {
        alert("El títol és obligatori");
        return;
    }

    if (tascaEditantId) {
        const index = tasques.findIndex(t => t.id === tascaEditantId);
        tasques[index] = {
            ...tasques[index],
            titol,
            descripcio,
            prioritat,
            estat,
            dataVenciment
        };
        tascaEditantId = null;
    } else {
        tasques.push({
            id: Date.now().toString(),
            titol,
            descripcio,
            prioritat,
            estat,
            dataVenciment,
            creatEl: new Date().toISOString()
        });
    }

    guardarTasques(tasques);
    renderTauler();
    form.reset();
});

function renderTauler() {
    document.getElementById("perFer").innerHTML = "";
    document.getElementById("enCurs").innerHTML = "";
    document.getElementById("fet").innerHTML = "";

    tasques.forEach(tasca => {
        const div = document.createElement("div");
        div.classList.add("tasca", tasca.prioritat);

        div.innerHTML = `
            <h4>${tasca.titol}</h4>
            <p>${tasca.descripcio}</p>
            <small>Prioritat: ${tasca.prioritat}</small><br>
            <small>Data límit: ${tasca.dataVenciment || "-"}</small><br>

            <select onchange="canviarEstat('${tasca.id}', this.value)">
                <option value="perFer" ${tasca.estat === "perFer" ? "selected" : ""}>Per fer</option>
                <option value="enCurs" ${tasca.estat === "enCurs" ? "selected" : ""}>En curs</option>
                <option value="fet" ${tasca.estat === "fet" ? "selected" : ""}>Fet</option>
            </select>

            <button onclick="editarTasca('${tasca.id}')">Editar</button>
            <button onclick="eliminarTasca('${tasca.id}')">Eliminar</button>
        `;

        document.getElementById(tasca.estat).appendChild(div);
    });
}

function canviarEstat(id, nouEstat) {
    const tasca = tasques.find(t => t.id === id);
    tasca.estat = nouEstat;
    guardarTasques(tasques);
    renderTauler();
}

function eliminarTasca(id) {
    if (!confirm("Segur que vols eliminar aquesta tasca?")) return;
    tasques = tasques.filter(t => t.id !== id);
    guardarTasques(tasques);
    renderTauler();
}

function editarTasca(id) {
    const tasca = tasques.find(t => t.id === id);

    document.getElementById("titol").value = tasca.titol;
    document.getElementById("descripcio").value = tasca.descripcio;
    document.getElementById("prioritat").value = tasca.prioritat;
    document.getElementById("estat").value = tasca.estat;
    document.getElementById("data").value = tasca.dataVenciment;

    tascaEditantId = id;
}

renderTauler();
