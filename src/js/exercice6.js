function init() {
  try {
    let liste = ["MA0001", "MA0007", "MA0027", "MA0011", "MA0010", "MA0017"];
    let tableTotal = new DataTable("#total", {
      ajax: {
        url: "/data/exercice-recherches",
        dataSrc: function (json) {
          let data = json.data;
          return liste.map((element) => {
            if (data.find((obj) => obj.matricule == element) !== undefined) {
              return data.find((obj) => obj.matricule == element);
            } else {
              let jsonOutput = {};
              Object.keys(data[0]).forEach((obj) => {
                jsonOutput[obj] = obj == "matricule" ? element : "Inconnu";
              });
              return jsonOutput;
            }
          });
        },
      },
      columns: [
        { data: "matricule", title: "Matricule" },
        { data: "nom", title: "Nom" },
        { data: "prenom", title: "Prénom" },
        { data: "ville", title: "Ville" },
      ],
    });
  } catch (error) {
    console.error(error);
  }
}

if (localStorage.token == undefined) {
  location.href = "/login";
} else {
  init();
}
