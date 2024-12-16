async function init() {
  try {
    let nbCas = 10;
    for (let index = 1; index <= nbCas; index++) {
      document.querySelector("ul.nav-tabs").innerHTML += `
    <li class="nav-item" role="presentation">
                <a class="nav-link ${
                  index == 1 ? "active" : ""
                }" data-bs-toggle="tab" href="#tab${index}" aria-selected="true" role="tab">Cas ${index}
                </a>
            </li>
    `;
      document.querySelector("#myTabContent").innerHTML += `
     <div class="tab-pane fade ${
       index == 1 ? "show active" : ""
     }" id="tab${index}" role="tabpanel">
                <div class="album py-5 bg-body-tertiary">
                    <div class="container d-grid" style="grid-template-columns:max-content; gap:10% ">
                        <table id="tableCas${index}" class="display table-bordered">
                            <tfoot>
                                <tr></tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
     `;
    }

    //   console.log(nbJoursComptants("01/02/2007", "15/02/2007"));
    let jsonCas1 = await fetch("/src/json/exercice7Cas1.json").then((res) =>
      res.json()
    );
    let jsonCas2 = await fetch("/src/json/exercice7Cas2.json").then((res) =>
      res.json()
    );
    let jsonCas3 = await fetch("/src/json/exercice7Cas3.json").then((res) =>
      res.json()
    );
    let jsonCas4 = await fetch("/src/json/exercice7Cas4.json").then((res) =>
      res.json()
    );
    let jsonCas5 = await fetch("/src/json/exercice7Cas5.json").then((res) =>
      res.json()
    );
    let jsonCas6 = await fetch("/src/json/exercice7Cas6.json").then((res) =>
      res.json()
    );
    let jsonCas7 = await fetch("/src/json/exercice7Cas7.json").then((res) =>
      res.json()
    );
    let jsonCas8 = await fetch("/src/json/exercice7Cas8.json").then((res) =>
      res.json()
    );
    // Cas 1
    let tableCas1 = new DataTable("#tableCas1", {
      data: jsonCas1,
      columns: [
        { data: "travaux", title: "TRAVAUX" },
        { data: "joursprevus", title: "Nbre jours prévus" },
        { data: "datedebut", title: "Date début" },
        { data: "datefin", title: "Date fin" },
        {
          data: function (row, type, set, meta) {
            return nbJoursComptants(row.datedebut, row.datefin);
          },
          title: "Nbre de jours réels",
        },
        {
          data: "coutjour",
          title: "Coût par jour",
          render: function (data, type, row) {
            return data.toFixed(2) + " €";
          },
        },
        {
          data: function (row, type, set, meta) {
            return nbJoursComptants(row.datedebut, row.datefin) * row.coutjour;
          },
          title: "Coût total",
          render: function (data, type, row) {
            return data.toFixed(2) + " €";
          },
        },
      ],
    });
    // Cas 2
    let tableCas2 = new DataTable("#tableCas2", {
      data: jsonCas2,
      columns: [
        { data: "date", title: "Date" },
        {
          data: "compteur",
          title: "Nombre de Km au compteur",
          render: function (data, type, row) {
            return data + "  Km";
          },
        },
        {
          data: "qtePlein",
          title: "Quantité essence PLEIN",
          render: function (data, type, row) {
            return data != "" ? data.toFixed(2) + " litres" : data;
          },
        },
        {
          data: "prixLitre",
          title: "Prix litre",
          render: function (data, type, row) {
            return data != "" ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.qtePlein === undefined || row.prixLitre === undefined) {
              return 0;
            }
            return row.qtePlein * row.prixLitre;
          },
          title: "Total en Euros",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (meta.row < 1) return "";
            return (
              (row.qtePlein * 100) /
              (row.compteur - jsonCas2[meta.row - 1].compteur)
            );
          },
          title: "Consommation Litres aux 100 Km",
          render: function (data, type, row) {
            return data != "" ? data.toFixed(2) + " litres" : data;
          },
        },

        //   {
        //     data: "coutjour",
        //     title: "Coût par jour",
        //     render: function (data, type, row) {
        //       return data.toFixed(2) + " €";
        //     },
        //   },
      ],
      order: [],
      pageLength: jsonCas2.length,
    });
    // Cas 3
    document.querySelector("#tab3").innerHTML =
      `
  <fieldset>
    <legend>Informations client</legend>
    <div class="row">
      <label for="nomClient" class="col-sm-2 col-form-label">Nom/Prénom</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="nomClient" value="Monsieur DUPONT">
      </div>
      <label for="adresseClient" class="col-sm-2 col-form-label">Adresse</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="adresseClient" value="22 Bd des Capucines">
      </div>
      <label for="codePostal" class="col-sm-2 col-form-label">Code Postal</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="codePostal" value="7500 PARIS">
      </div>
      <label for="dateClient" class="col-sm-2 col-form-label">Date</label>
      <div class="col-sm-10">
        <input type="date" class="form-control"  id="dateClient" value="${luxon.DateTime.fromJSDate(
          new Date()
        ).toISODate()}" />
      </div>
    </div>
    </fieldset>
  ` + document.querySelector("#tab3").innerHTML;
    let tableCas3 = new DataTable("#tableCas3", {
      data: jsonCas3,
      columns: [
        { data: "designation", title: "DESIGNATION" },
        { data: "qte", title: "QTE" },
        {
          data: "prixUnit",
          title: "PRIX UNITAIRE",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.qte === undefined || row.prixUnit === undefined) {
              return 0;
            }
            return row.qte * row.prixUnit;
          },
          title: "Montant",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: "remise",
          title: "% de remise",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " %" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.qte === undefined || row.prixUnit === undefined) {
              return 0;
            }
            return row.qte * row.prixUnit * (row.remise / 100);
          },
          title: "Montant remise",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.qte === undefined || row.prixUnit === undefined) {
              return 0;
            }
            return (
              row.qte * row.prixUnit -
              row.qte * row.prixUnit * (row.remise / 100)
            );
          },
          title: "Montant Net",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
      ],
      order: [],
      footerCallback: function (row, data, start, end, display) {
        let api = this.api();
      },
    });
    let remiseCas3 = 0.01;
    let tvaCas3 = 0.196;
    tableCas3.tables().footer()[0].innerHTML = `
  <tr>
    <td colspan=4></td>
    <td class="dt-type-numeric">TOTAL HT</td>
    <td class="dt-type-numeric">${tableCas3
      .column(5)
      .data()
      .reduce((a, b) => a + b, 0)} €</td>
    <td class="dt-type-numeric">${tableCas3
      .column(6)
      .data()
      .reduce((a, b) => a + b, 0)} €</td>
</tr>
<tr>
    <td colspan=4></td>
    <td class="dt-type-numeric">Remise reglement comptant</td>
    <td class="dt-type-numeric">1 %</td>
    <td class="dt-type-numeric">${(
      tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) * remiseCas3
    ).toFixed(2)} €</td>
</tr>
<tr>
    <td colspan=4></td>
    <td class="dt-type-numeric">TOTAL HT</td>
    <td class="dt-type-numeric"></td>
    <td class="dt-type-numeric">${(
      tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) -
      tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) *
        remiseCas3
    ).toFixed(2)} €</td>
</tr>
<tr>
    <td colspan=4></td>
<td class="dt-type-numeric">TVA</td>
    <td class="dt-type-numeric">19.60 %</td>
    <td class="dt-type-numeric">${(
      (tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) -
        tableCas3
          .column(6)
          .data()
          .reduce((a, b) => a + b, 0) *
          remiseCas3) *
      tvaCas3
    ).toFixed(2)} €</td>
</tr>
<tr>
    <td colspan=5></td>
    <td class="dt-type-numeric text-bold">Total TTC</td>
    <td class="dt-type-numeric">${(
      tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) -
      tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) *
        remiseCas3 +
      (tableCas3
        .column(6)
        .data()
        .reduce((a, b) => a + b, 0) -
        tableCas3
          .column(6)
          .data()
          .reduce((a, b) => a + b, 0) *
          remiseCas3) *
        tvaCas3
    ).toFixed(2)} €</td>
</tr>
  `;
    // Cas 4
    document.querySelector("#tab4").innerHTML =
      `
  <fieldset>
    <legend>Informations client</legend>
    <div class="row">
      <label for="domaineClient" class="col-sm-2 col-form-label">Raison Sociale</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="nomClient" value="AUX FRUITS DORES">
      </div>
      <label for="adresseClient" class="col-sm-2 col-form-label">Adresse</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="adresseClient" value="274 Rue de Marseille ">
      </div>
      <label for="codePostal" class="col-sm-2 col-form-label">Code Postal</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="codePostal" value="69007 LYON">
      </div>
      <label for="codeClient" class="col-sm-2 col-form-label">Code</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="codeClient" value="RCS Lyon B 347256123789" />
      </div>
      <label for="commandeClient" class="col-sm-2 col-form-label">Commande N°</label>
      <div class="col-sm-10">
        <input type="number" class="form-control" id="codeClient" value="267" />
      </div>
      <label for="dateClient" class="col-sm-2 col-form-label">Date</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="dateClient" value="${luxon.DateTime.fromJSDate(
          new Date()
        )
          .setLocale("fr")
          .toLocaleString(luxon.DateTime.DATE_MED_WITH_WEEKDAY)}" />
      </div>
    </div>
    </fieldset>
  ` + document.querySelector("#tab4").innerHTML;
    let tableCas4 = new DataTable("#tableCas4", {
      data: jsonCas4,
      dom: "Bfrtip",
      columns: [
        { data: "ref", title: "Ref." },
        { data: "designation", title: "DESIGNATION" },
        { data: "qte", title: "Quantité" },
        {
          data: "prixUnit",
          title: "PRIX UNITAIRE",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.qte === undefined || row.prixUnit === undefined) {
              return 0;
            }
            return row.qte * row.prixUnit;
          },
          title: "Montant H.T",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
      ],
      order: [],
      footerCallback: function (row, data, start, end, display) {
        let api = this.api();
      },
      // layout: {
      //   topStart: {
      //     buttons: ["copy", "pdf"],
      //   },
      // },
    });
    let remiseCas4 = 0.08;
    let tvaCas4 = 0.196;
    tableCas4.tables().footer()[0].innerHTML = `
  <tr>
    <td class="dt-type-numeric" colspan=2>Observations :</td> 
    <td class="dt-type-numeric" colspan=2>TOTAL HT</td>
    <td class="dt-type-numeric">${tableCas4
      .column(4)
      .data()
      .reduce((a, b) => a + b, 0)
      .toFixed(2)} €</td>
</tr>
  <tr>
    <td class="dt-type-numeric" colspan=2></td> 
    <td class="dt-type-numeric" colspan=2>Remise ${remiseCas4 * 100}%</td>
    <td class="dt-type-numeric">${(
      tableCas4
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) * remiseCas4
    ).toFixed(2)} €</td>
</tr>  
<tr>
    <td class="dt-type-numeric" colspan=2></td> 
    <td class="dt-type-numeric" colspan=2>Montant à payer TTC (${
      tvaCas4 * 100
    }%)</td>
    <td class="dt-type-numeric">${(
      tableCas4
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) -
      tableCas4
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) *
        remiseCas4
    ).toFixed(2)} €</td>
</tr>

  `;
    // Cas 5
    document.querySelector("#tab5").innerHTML =
      `
  <fieldset>
    <legend>Catalogue des prix de l'entreprise BRICOLTOUT</legend>
    </fieldset>
  ` + document.querySelector("#tab5").innerHTML;
    let tvaCas5 = 0.085;
    let tableCas5 = new DataTable("#tableCas5", {
      data: jsonCas5,
      columns: [
        { data: "ref", title: "DESIGNATION" },
        {
          data: "prix",
          title: "Prix HT",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        { data: "coeff", title: "Coefficient de marge" },
        {
          data: function (row, type, val, meta) {
            if (row.prix === undefined || row.coeff === undefined) {
              return 0;
            }
            return row.prix * row.coeff;
          },
          title: "Prix Vente HT",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            return tvaCas5;
          },
          title: "TVA",
          render: function (data, type, row) {
            return (data * 100).toFixed(2) + " %";
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.prix === undefined || row.coeff === undefined) {
              return 0;
            }
            return row.prix * row.coeff * (1 + tvaCas5);
          },
          title: "Prix Vente TTC",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
      ],
      order: [],
      footerCallback: function (row, data, start, end, display) {
        let api = this.api();
      },
    });
    // Cas 6
    let remiseCas6 = 0.05;
    let tvaCas6 = 0.196;
    let tableCas6 = new DataTable("#tableCas6", {
      data: jsonCas6,
      columns: [
        { data: "ref", title: "Réf." },
        { data: "titre", title: "Désignation des articles" },
        { data: "qte", title: "Quantité" },
        {
          data: "prixUnit",
          title: "P.U. tarif H.T.",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.prixUnit === undefined || row.qte === undefined) {
              return 0;
            }
            return row.prixUnit * row.qte;
          },
          title: "Montant  H.T.",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
      ],
      order: [],
      footerCallback: function (row, data, start, end, display) {
        let api = this.api();
      },
    });
    tableCas6.tables().footer()[0].innerHTML = `
  <tr>
    <td class="dt-type-numeric" colspan=2 rowspan=5>Observations :</td> 
    <td class="dt-type-numeric" colspan=2>TOTAL</td>
    <td class="dt-type-numeric">${tableCas6
      .column(4)
      .data()
      .reduce((a, b) => a + b, 0)
      .toFixed(2)} €</td>
</tr>
  <tr>
    <td class="dt-type-numeric" colspan=2>Remise globale ${
      remiseCas6 * 100
    }%</td>
    <td class="dt-type-numeric">${(
      tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) * remiseCas6
    ).toFixed(2)} €</td>
</tr>  
  <tr>
    <td class="dt-type-numeric" colspan=2>Total H.T.</td>
    <td class="dt-type-numeric">${(
      tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) -
      tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) *
        remiseCas6
    ).toFixed(2)} €</td>
</tr>  
<tr>
    <td class="dt-type-numeric" colspan=2>TVA (${tvaCas6 * 100}%) </td>
    <td class="dt-type-numeric">${(
      (tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) -
        tableCas6
          .column(4)
          .data()
          .reduce((a, b) => a + b, 0) *
          remiseCas6) *
      tvaCas6
    ).toFixed(2)} €</td>
</tr>  
<tr>
    <td class="dt-type-numeric" colspan=2>Net à payer </td>
    <td class="dt-type-numeric">${(
      tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) -
      tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) *
        remiseCas6 +
      (tableCas6
        .column(4)
        .data()
        .reduce((a, b) => a + b, 0) -
        tableCas6
          .column(4)
          .data()
          .reduce((a, b) => a + b, 0) *
          remiseCas6) *
        tvaCas6
    ).toFixed(2)} €</td>
</tr>

  `;
    // Cas 7
    document.querySelector("#tab7").innerHTML =
      `
  <fieldset>
    <legend>Catalogues des prix de l'entreprise MOTO-SCOOT</legend>
    <div class="row">
      <label for="tvaCas7" class=" col-form-label">TVA</label>
      <div class="col-sm-2">
        <input type="number" class="form-control" id="tvaCas7" value=20 min=0 max=100>
      </div>
      <label for="tvaCas7" class="col-sm-2 col-form-label">%</label>
    </div>
    </fieldset>
  ` + document.querySelector("#tab7").innerHTML;

    let tableCas7 = new DataTable("#tableCas7", {
      data: jsonCas7,
      columns: [
        { data: "designation", title: "Désignation ." },
        { data: "prix", title: "Prix Achat HT" },
        {
          data: "coeff",
          title: "coef. Vente",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            if (row.prix === undefined || row.coeff === undefined) {
              return 0;
            }
            return row.prix * row.coeff;
          },
          title: "Prix Vente HT",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
        {
          data: function (row, type, val, meta) {
            let tvaCas7 = document.querySelector("#tvaCas7").value;
            if (row.prix === undefined || row.coeff === undefined) {
              return 0;
            }
            return (
              row.prix * row.coeff + (row.prix * row.coeff * tvaCas7) / 100
            );
          },
          title: "PV TTC",
          render: function (data, type, row) {
            return data != 0 ? data.toFixed(2) + " €" : data;
          },
        },
      ],
      order: [],
      drawCallback: function (settings) {
        let api = this.api();
        let tvaCas7 = document.querySelector("#tvaCas7").value;
        for (let index = 0; index < api.column(4).data().length; index++) {
          let prix = api.column(2).data()[index];
          let coeff = api.column(3).data()[index];
          if (prix === undefined || coeff === undefined) {
            api.column(4).data()[index] = 0;
          }
          api.column(4).data()[index] =
            prix * coeff + (prix * coeff * tvaCas7) / 100;
        }
      },
      footerCallback: function (row, data, start, end, display) {
        let api = this.api();
      },
    });

    document.querySelector("#tvaCas7").addEventListener("change", function () {
      tableCas7.draw();
    });
    // Cas 8
    document.querySelector("#tab8").innerHTML =
      `
  <fieldset>
    <legend>PRIX DE VENTE PRODUIT</legend>
    </fieldset>
  ` + document.querySelector("#tab8").innerHTML;
  } catch (error) {
    console.error(error);
  }
}

if (localStorage.token == undefined) {
  location.href = "/login";
} else {
  init();
}

function nbJoursComptants(jour1, jour2) {
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let date1 = luxon.DateTime.fromFormat(jour1, "dd/MM/yyyy").toJSDate();
  let date2 = luxon.DateTime.fromFormat(jour2, "dd/MM/yyyy").toJSDate();
  let table = [];
  while (date1 <= date2) {
    table.push(date1);
    date1 = date1.addDays(1);
  }
  return table.filter(
    (element) => element.getDay() != 0 && element.getDay() != 6
  ).length;
}
