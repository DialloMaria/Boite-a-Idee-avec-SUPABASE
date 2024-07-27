

const API = 'https://kpjahhxffjbuyazkrvlw.supabase.co';
const APIKEYS = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwamFoaHhmZmpidXlhemtydmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMjkzMTksImV4cCI6MjAzNjcwNTMxOX0.mw7WgWuBqwtwATt3RhHLAIDcc4QQ2OS7t7xMf6yw7Cw';
const instance = supabase.createClient(API, APIKEYS);

document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.querySelector("#save");
    if (saveButton) {
        saveButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const libelle = document.querySelector("#libelle").value;
            const categorie = document.querySelector("#categorie").value;
            const description = document.querySelector("#description").value;

            saveButton.innerHTML = "Enregistrement...";
            saveButton.setAttribute("disabled", true);

            try {
                const { data, error } = await instance.from("idees").insert([{ libelle, categorie, description }]);

                if (error) {
                    console.error("Erreur lors de l'ajout de l'idée :", error);
                    alert("Erreur lors de l'ajout de l'idée : " + error.message);
                    saveButton.innerText = "Enregistrer";
                    saveButton.removeAttribute("disabled");
                } else {
                    console.log("Idée ajoutée avec succès :", data);
                    alert("Idée ajoutée avec succès");
                    const myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
                    myModal.hide();
                    document.querySelector("#ideaForm").reset();
                    getIdees(); // Recharger la liste des idées
                    saveButton.innerText = "Enregistrer";
                    saveButton.removeAttribute("disabled");
                }
            } catch (error) {
                console.error("Erreur inconnue :", error);
                alert("Erreur inconnue : " + error.message);
                saveButton.innerText = "Enregistrer";
                saveButton.removeAttribute("disabled");
            }
        });
    }
        const validateForm = (formId, errors) => {
            let isValid = true;
            Object.keys(errors).forEach((key) => {
                const input = document.querySelector(`#${formId} #${key}`);
                const errorDiv = document.querySelector(`#${formId} #${errors[key]}`);
                if (!input.value.trim()) {
                    errorDiv.innerText = "Ce champ est obligatoire";
                    isValid = false;
                } else {
                    errorDiv.innerText = "";
                }
            });
            return isValid;
        };
    

    const getIdees = async () => {
        const tbody = document.getElementById("tbody");
        const loading = document.getElementById("loading");
        let tr = "";
        loading.innerText = "Chargement...";

        try {
            const { data, error } = await instance.from("idees").select("*");
            if (error) {
                console.error("Erreur lors du chargement des idées :", error);
                alert("Erreur lors du chargement des idées : " + error.message);
                loading.innerText = "Erreur lors du chargement des idées";
            } else {
                console.log("Idées chargées :", data);
               
                data.forEach(idee => {
                    tr += `
                        <tr>
                            <td>${idee.id}</td>
                            <td>${idee.libelle}</td>
                            <td>${idee.categorie}</td>
                            <td>${idee.description}</td>
                            <td>
                                <button class="btn btn-warning" onclick="editIdee(${idee.id})" data-bs-toggle="modal" data-bs-target="#editModal">Modifier</button>
                            </td>
                            <td>
                                <button class="btn btn-danger" onclick="deleteIdee(${idee.id})">Supprimer</button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = tr;
                loading.innerText = "";
            }
        } catch (error) {
            console.error("Erreur inconnue lors du chargement des idées :", error);
            alert("Erreur inconnue lors du chargement des idées : " + error.message);
            loading.innerText = "Erreur lors du chargement des idées";
        }
    };

    window.editIdee = async (id) => {
        try {
            const { data, error } = await instance.from("idees").select("*").eq("id", id).single();
            if (error) {
                console.error("Erreur lors de la récupération de l'idée :", error);
                alert("Erreur lors de la récupération de l'idée : " + error.message);
            } else {
                // document.getElementById("edit-id").value = data.id;
                document.getElementById("edit-libelle").value = data.libelle;
                document.getElementById("edit-categorie").value = data.categorie;
                document.getElementById("edit-description").value = data.description;
            }
        } catch (error) {
            console.error("Erreur inconnue lors de la récupération de l'idée :", error);
            alert("Erreur inconnue lors de la récupération de l'idée : " + error.message);
        }
    };

    document.getElementById("editIdeaForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const libelle = document.getElementById("edit-libelle").value;
        const categorie = document.getElementById("edit-categorie").value;
        const description = document.getElementById("edit-description").value;

        const updateButton = document.getElementById("update");
        updateButton.innerHTML = "Modification...";
        updateButton.setAttribute("disabled", true);

        try {
            const { data, error } = await instance.from("idees").update({ libelle, categorie, description }).eq("id", id).single();
            if (error) {
                console.error("Erreur lors de la modification de l'idée :", error);
                alert("Erreur lors de la modification de l'idée : " + error.message);
                updateButton.innerText = "Modifier";
                updateButton.removeAttribute("disabled");
            } else {
                console.log("Idée modifiée avec succès :", data);
                alert("Idée modifiée avec succès");
                const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                editModal.hide();
                getIdees(); // Recharger la liste des idées
                updateButton.innerText = "Modifier";
                updateButton.removeAttribute("disabled");
            }
        } catch (error) {
            console.error("Erreur inconnue lors de la modification de l'idée :", error);
            alert("Erreur inconnue lors de la modification de l'idée : " + error.message);
            updateButton.innerText = "Modifier";
            updateButton.removeAttribute("disabled");
        }
    });

    window.deleteIdee = async (id) => {
        if (("Êtes-vous sûr de vouloir supprimer cette idée ?")) {
            // if (confirm("Êtes-vous sûr de vouloir supprimer cette idée ?")) {
            try {
                const { data, error } = await instance.from("idees").delete().eq("id", id);
                if (error) {
                    console.error("Erreur lors de la suppression de l'idée :", error);
                    alert("Erreur lors de la suppression de l'idée : " + error.message);
                } else {
                    console.log("Idée supprimée avec succès :", data);
                    alert("Idée supprimée avec succès");
                    getIdees(); // Recharger la liste des idées
                }
            } catch (error) {
                console.error("Erreur inconnue lors de la suppression de l'idée :", error);
                alert("Erreur inconnue lors de la suppression de l'idée : " + error.message);
            }
        }
    };

    getIdees();
});
