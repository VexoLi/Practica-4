const STORAGE_KEY = "tasquesKanban";

// Leer tareas de localStorage
function carregarTasques() {
    const dades = localStorage.getItem(STORAGE_KEY);
    return dades ? JSON.parse(dades) : [];
}

// Guardar tareas en localStorage
function guardarTasques(tasques) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasques));
}

let tasques = carregarTasques();

if (tasques.length === 0) {
    tasques = [
        {
            id: Date.now().toString(),
            titol: "Primera tasca",
            descripcio: "Això és una tasca de prova",
            prioritat: "mitjana",
            dataVenciment: "2026-01-10",
            estat: "perFer",
            creatEl: new Date().toISOString()
        }
    ];

    guardarTasques(tasques);
}
