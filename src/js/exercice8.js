async function init() {
  let jsonDataExo8 = await fetch("/data/article-exo8s").then((res) =>
    res.json()
  );

  let tableTotal = new DataTable("#total", {
    ajax: {
      url: "/data/article-exo8s",
    },
    columns: [
      { data: "date", title: "Dates" },
      { data: "article", title: "Articles" },
      { data: "quantite", title: "Quantités facturées" },
    ],
  });

  let tableMontant = new DataTable("#montants", {
    dom: 'Bf<"toolbar">tip',
    buttons: [],
    ajax: {
      url: "/data/article-exo8s",
      dataSrc: function (json) {
        let data = json.data;
        let listeFamilles = [
          ...new Set(data.map((element) => element.famille)),
        ];
        let jsonOutput = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          let dataJson = {};
          listeFamilles.forEach((obj) => {
            dataJson[obj.toLowerCase()] =
              element.famille == obj ? element.prix : "";
          });
          jsonOutput.push(dataJson);
        }

        return jsonOutput;
      },
    },
    columns: [...new Set(jsonDataExo8.data.map((element) => element.famille))]
      .sort()
      .map((obj) => {
        return {
          data: obj.toLowerCase(),
          title: obj,
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
          footer: "0",
        };
      }),
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      let intVal = function (i) {
        return typeof i === "string"
          ? i.replace(/[\$,]/g, "") * 1
          : typeof i === "number"
          ? i
          : 0;
      };

      for (
        let index = 0;
        index <
        [...new Set(jsonDataExo8.data.map((element) => element.famille))]
          .length;
        index++
      ) {
        total = api
          .column(index)
          .data()
          .reduce((a, b) => intVal(a) + intVal(b), 0);
        $(api.column(index).footer()).html(`${total.toFixed(2)} €`);
      }
    },
    pageLength: jsonDataExo8.data.length,
    order: [],
    ordering: false,
  });
  $("div.toolbar").html("<b>Montant facturés par famille d'articles</b>");

  let tableFactures = new DataTable("#factures", {
    ajax: {
      url: "/data/article-exo8s",
      dataSrc: function (json) {
        let data = json.data;
        let listeFamilles = [
          ...new Set(data.map((element) => element.famille)),
        ];
        return listeFamilles.map((element) => {
          let dataFamille = data.filter((obj) => obj.famille == element);
          let jsonOutput = {};
          jsonOutput["famille"] = element;
          jsonOutput["total"] = dataFamille
            .map((element) => element.quantite)
            .reduce((a, b) => a + b, 0);
          jsonOutput["formation"] = dataFamille
            .map((element) => element.prix)
            .reduce((a, b) => a + b, 0);

          return jsonOutput;
        });
      },
    },
    columns: [
      { data: "famille", title: "Familles", footer: "0" },
      { data: "total", title: "Nombre de facture" },
      {
        data: "formation",
        title: "FORMATION",
        render: function (data, type, row) {
          return data != 0 ? data.toFixed(2) + " €" : data;
        },
      },
      {
        data: function (row, type, val, meta) {
          let total = meta.settings.aoData
            .map((element) => element._aData.formation)
            .reduce((a, b) => a + b, 0);
          return row.formation / total;
        },
        title: "CA en %",
        render: function (data, type, row) {
          return data != 0 ? (data * 100).toFixed(2) + " %" : data;
        },
      },
      {
        data: function (row, type, val, meta) {
          return row.formation > 10000 ? "OUI" : "NON";
        },
        title: "Prime",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();

      $(api.column(0).footer()).html(`Total`);
      $(api.column(2).footer()).html(
        `${api
          .column(2)
          .data()
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} €`
      );
    },
  });

  let tableCA = new DataTable("#ca", {
    ajax: {
      url: "/data/article-exo8s",
      dataSrc: function (json) {
        let data = json.data;
        let listeFamilles = [
          ...new Set(data.map((element) => element.famille)),
        ];
        let listeData = listeFamilles.map((element) => {
          let dataFamille = data.filter((obj) => obj.famille == element);
          let jsonOutput = {};
          jsonOutput["famille"] = element;
          jsonOutput["total"] = dataFamille
            .map((element) => element.quantite)
            .reduce((a, b) => a + b, 0);
          jsonOutput["formation"] = dataFamille
            .map((element) => element.prix)
            .reduce((a, b) => a + b, 0);

          return jsonOutput;
        });
        let jsonOutput = [];
        jsonOutput.push({
          name: "CA MAXIMUM par famille",
          data: listeData
            .map((element) => element.formation)
            .reduce((a, b) => (a > b ? a : b), 0),
        });

        jsonOutput.push({
          name: "CA MINIMUM par famille",
          data: listeData
            .map((element) => element.formation)
            .reduce((a, b) => (a < b ? a : b), jsonOutput[0].data),
        });
        jsonOutput.push({
          name: "CA Moyen par famille",
          data: listeData
            .map((element) => element.formation)
            .reduce((a, b) => a + b / listeData.length, 0),
        });

        return jsonOutput;
      },
    },
    columns: [
      { data: "name" },
      {
        data: "data",
        render: function (data, type, row) {
          return data.toFixed(2) + " €";
        },
      },
    ],
  });
  let tableClassement = new DataTable("#classement", {
    ajax: {
      url: "/data/article-exo8s",
      dataSrc: function (json) {
        let data = json.data;
        let listeFamilles = [
          ...new Set(data.map((element) => element.famille)),
        ];
        let listeData = listeFamilles.map((element) => {
          let dataFamille = data.filter((obj) => obj.famille == element);
          let jsonOutput = {};
          jsonOutput["famille"] = element;
          jsonOutput["total"] = dataFamille
            .map((element) => element.quantite)
            .reduce((a, b) => a + b, 0);
          jsonOutput["formation"] = dataFamille
            .map((element) => element.prix)
            .reduce((a, b) => a + b, 0);

          return jsonOutput;
        });
        let jData = listeData;
        jData.sort((a, b) => (a.formation < b.formation ? 1 : -1));

        console.log(jData);
        return listeData.map((element) => {
          let jsonOutput = {};
          jsonOutput["famille"] = element.famille;
          jsonOutput["rang"] =
            1 + jData.findIndex((obj) => obj.famille == element.famille);
          console.log(element.famille);

          return jsonOutput;
        });
      },
    },
    columns: [
      { data: "famille", title: "Famille" },
      {
        data: "rang",
        title: "Rang",
      },
    ],
  });
}
init();
