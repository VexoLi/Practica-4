const STORAGE_KEY = "tasquesKanban";

/* ---------- Persistència ---------- */
function carregarTasques() {
    const dades = localStorage.getItem(STORAGE_KEY);
    return dades ? JSON.parse(dades) : [];
}

function guardarTasques(tasques) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasques));
}

/* ---------- Estat global ---------- */
let tasques = carregarTasques();
let tascaEditantId = null;

/* ---------- Elements DOM ---------- */
const form = document.getElementById("tasca-form");
const cercaInput = document.getElementById("cerca");
const filtreEstat = document.getElementById("filtre-estat");
const filtrePrioritat = document.getElementById("filtre-prioritat");

/* ---------- Crear / Editar ---------- */
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

/* ---------- Filtrat ---------- */
function getTasquesFiltrades(tasques) {
    const text = cercaInput.value.toLowerCase();
    const estat = filtreEstat.value;
    const prioritat = filtrePrioritat.value;

    return tasques.filter(t => {
        const coincideixText =
            t.titol.toLowerCase().includes(text) ||
            t.descripcio.toLowerCase().includes(text);

        const coincideixEstat = !estat || t.estat === estat;
        const coincideixPrioritat = !prioritat || t.prioritat === prioritat;

        return coincideixText && coincideixEstat && coincideixPrioritat;
    });
}

/* ---------- Render ---------- */
function renderTauler() {
    document.getElementById("perFer").innerHTML = "";
    document.getElementById("enCurs").innerHTML = "";
    document.getElementById("fet").innerHTML = "";

    const tasquesFiltrades = getTasquesFiltrades(tasques);

    tasquesFiltrades.forEach(tasca => {
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

/* ---------- Accions ---------- */
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

/* ---------- Listeners filtres ---------- */
cercaInput.addEventListener("input", renderTauler);
filtreEstat.addEventListener("change", renderTauler);
filtrePrioritat.addEventListener("change", renderTauler);

/* ---------- Inicial ---------- */
renderTauler();
