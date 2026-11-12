
/* ========================================
   1. CONFIGURAZIONE
======================================== */

const API_URL = "http://127.0.0.1:8000";

const fields = [
    "name",
    "age",
    "village",
    "rank",
    "clan",
    "chackra_nature"
];

let selectedCharacterId = null;
let originalCharacter = null;


/* ========================================
   2. ELEMENTI HTML
======================================== */

const charactersContainer = document.getElementById("characters-container");
const charactersStatus = document.getElementById("characters-status");
const charactersTitle = document.getElementById("characters-title");

const characterDetail = document.getElementById("character-detail");
const detailContent = document.getElementById("detail-content");
const detailTitle = document.getElementById("detail-title");
const backButton = document.getElementById("back-to-characters");

const createSection = document.querySelector(".create-character-section");
const createForm = document.getElementById("create-character-form");
const createButton = document.getElementById("create-character-button");
const formStatus = document.getElementById("form-status");

const editForm = document.getElementById("edit-character-form");
const editStatus = document.getElementById("edit-status");
const putButton = document.getElementById("save-put");
const patchButton = document.getElementById("save-patch");
const deleteButton = document.getElementById("delete-character-button");
const deleteStatus = document.getElementById("delete-status");

/* ========================================
   3. FUNZIONI DI SUPPORTO
======================================== */

// Mostra i messaggi della lista
function showStatus(message, error = false) {
    charactersStatus.textContent = message;
    charactersStatus.setAttribute("role", error ? "alert" : "status");
}

// Esegue una richiesta all'API
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return response.json();
}

// Legge i dati di un formulario
function readForm(form) {
    const data = new FormData(form);

    return {
        name: data.get("name").trim(),
        age: Number(data.get("age")),
        village: data.get("village").trim(),
        rank: data.get("rank").trim(),
        clan: data.get("clan").trim(),
        chackra_nature: data.get("chackra_nature").trim()
    };
}

// Prepara i dati JSON per POST, PUT e PATCH
function jsonOptions(method, data) {
    return {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
}

// Alterna la lista e la vista dettagli
function toggleCharacterView(showDetails) {
    if (charactersTitle) {
        charactersTitle.hidden = showDetails;
    }

    charactersContainer.hidden = showDetails;
    charactersStatus.hidden = showDetails;
    createSection.hidden = showDetails;

    characterDetail.hidden = !showDetails;
}


/* ========================================
   4. CREAZIONE CARD PERSONAGGIO
======================================== */

function createCharacterCard(character, withButton = true) {
    const article = document.createElement("article");
    article.className = "character-card";

    const title = document.createElement("h3");
    title.textContent = character.name;
    article.appendChild(title);

    const information = [
        ["Edad", character.age],
        ["Aldea", character.village],
        ["Rango", character.rank],
        ["Clan", character.clan ?? "No especificado"],
        [
            "Naturaleza del chakra",
            character.chackra_nature ?? "No especificada"
        ]
    ];

    information.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${label}: ${value}`;
        article.appendChild(paragraph);
    });

    if (withButton) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "detail-button";
        button.textContent = "Ver detalles";

        button.setAttribute(
            "aria-label",
            `Ver detalles de ${character.name}`
        );

        button.addEventListener("click", () => {
            showCharacterDetail(character.id);
        });

        article.appendChild(button);
    }

    return article;
}


/* ========================================
   5. GET - LISTA PERSONAGGI
======================================== */

async function loadCharacters() {
    charactersContainer.setAttribute("aria-busy", "true");
    charactersContainer.replaceChildren();

    showStatus("Cargando personajes...");

    try {
        const characters = await apiRequest("/characters");

        if (!Array.isArray(characters)) {
            throw new Error("Respuesta de API no válida");
        }

        if (characters.length === 0) {
            showStatus("No hay personajes registrados.");
            return;
        }

        const fragment = document.createDocumentFragment();

        characters.forEach(character => {
            fragment.appendChild(createCharacterCard(character));
        });

        charactersContainer.appendChild(fragment);

        showStatus(
            `Se han cargado ${characters.length} personajes correctamente.`
        );

    } catch (error) {
        console.error("Error al cargar personajes:", error);

        showStatus(
            "No se pudieron cargar los personajes. Comprueba la conexión con el servidor.",
            true
        );

    } finally {
        charactersContainer.setAttribute("aria-busy", "false");
    }
}


/* ========================================
   6. POST - CREARE PERSONAGGIO
======================================== */

async function createCharacter(event) {
    event.preventDefault();

    if (!createForm.reportValidity()) return;

    const character = readForm(createForm);

    createButton.disabled = true;
    formStatus.textContent = "Guardando personaje...";

    try {
        await apiRequest(
            "/characters",
            jsonOptions("POST", character)
        );

        createForm.reset();
        formStatus.textContent = "Personaje añadido correctamente.";

        await loadCharacters();

    } catch (error) {
        console.error("Error al crear personaje:", error);

        formStatus.textContent =
            "No se pudo añadir el personaje. Comprueba los datos.";

    } finally {
        createButton.disabled = false;
    }
}


/* ========================================
   7. GET - DETTAGLI PERSONAGGIO
======================================== */

async function showCharacterDetail(characterId) {
    showStatus("Cargando detalles...");

    try {
        const character = await apiRequest(
            `/characters/${characterId}`
        );

        selectedCharacterId = character.id;
        originalCharacter = character;

        // Mostra la scheda del personaggio
        detailContent.replaceChildren(
            createCharacterCard(character, false)
        );

        // Compila il formulario di modifica
        fields.forEach(field => {
            editForm.elements.namedItem(field).value =
                character[field] ?? "";
        });

        editStatus.textContent = "";

        // Nasconde la lista e mostra i dettagli
        toggleCharacterView(true);

        // Sposta il focus sul titolo dei dettagli
        detailTitle.focus();

    } catch (error) {
        console.error("Error al cargar detalles:", error);

        showStatus(
            "No se pudieron cargar los detalles del personaje.",
            true
        );
    }
}


/* ========================================
   8. RITORNO ALLA LISTA
======================================== */

async function backToCharacters() {
    toggleCharacterView(false);

    selectedCharacterId = null;
    originalCharacter = null;

    await loadCharacters();
}


/* ========================================
   9. PUT / PATCH - MODIFICARE PERSONAGGIO
======================================== */

async function updateCharacter(method) {
    if (selectedCharacterId === null || !originalCharacter) {
        return;
    }

    if (!editForm.reportValidity()) return;

    const editedCharacter = readForm(editForm);

    let dataToSend = editedCharacter;

    // PATCH invia solo i campi modificati
    if (method === "PATCH") {
        dataToSend = {};

        fields.forEach(field => {
            const originalValue = originalCharacter[field] ?? "";

            if (editedCharacter[field] !== originalValue) {
                dataToSend[field] = editedCharacter[field];
            }
        });

        if (Object.keys(dataToSend).length === 0) {
            editStatus.textContent = "No hay cambios para guardar.";
            return;
        }
    }

    putButton.disabled = true;
    patchButton.disabled = true;
    editStatus.textContent = "Guardando cambios...";

    try {
        const updatedCharacter = await apiRequest(
            `/characters/${selectedCharacterId}`,
            jsonOptions(method, dataToSend)
        );

        originalCharacter = updatedCharacter;

        // Aggiorna i dettagli dopo il salvataggio
        detailContent.replaceChildren(
            createCharacterCard(updatedCharacter, false)
        );

        editStatus.textContent =
            "Personaje actualizado correctamente.";

    } catch (error) {
        console.error("Error al actualizar personaje:", error);

        editStatus.textContent =
            "No se pudieron guardar los cambios.";

    } finally {
        putButton.disabled = false;
        patchButton.disabled = false;
    }
}

/* ========================================
   10. DELETE - ELIMINARE PERSONAGGIO
======================================== */

async function deleteCharacter() {
    if (selectedCharacterId === null || !originalCharacter) {
        return;
    }

    const confirmed = window.confirm(
        `¿Seguro que quieres eliminar a ${originalCharacter.name}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
        return;
    }

    deleteButton.disabled = true;
    deleteStatus.textContent = "Eliminando personaje...";

    try {
        await apiRequest(
            `/characters/${selectedCharacterId}`,
            { method: "DELETE" }
        );

        // Torna alla lista dopo l'eliminazione
        await backToCharacters();

        showStatus("Personaje eliminado correctamente.");

    } catch (error) {
        console.error("Error al eliminar personaje:", error);

        deleteStatus.textContent =
            "No se pudo eliminar el personaje. Inténtalo de nuevo.";

    } finally {
        deleteButton.disabled = false;
    }
}
/* ========================================
   11. INIZIALIZZAZIONE
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Carica i personaggi all'apertura della pagina
    loadCharacters();

    // Creazione personaggio
    createForm.addEventListener("submit", createCharacter);

    // Ritorno alla lista
    backButton.addEventListener("click", backToCharacters);

    // Evita che Enter ricarichi la pagina nel form di modifica
    editForm.addEventListener("submit", event => {
        event.preventDefault();
    });

    // Modifica completa
    putButton.addEventListener("click", () => {
        updateCharacter("PUT");
    });

    // Modifica parziale
    patchButton.addEventListener("click", () => {
        updateCharacter("PATCH");
    });
    // Eliminazione personaggio
    deleteButton.addEventListener("click", deleteCharacter);
});
