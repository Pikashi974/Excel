async function init() {
  try {
    let tableEleves = new DataTable("#liste", {
      ajax: {
        url: "/data/eleves",
        dataSrc: "data",
      },
      columns: [
        { name: "Elève", data: "nom" },
        { name: "Âge", data: "age" },
        {
          name: "Genre",
          data: function (row, type, set, meta) {
            return capitalizeFirstLetter(row.genre);
          },
        },
        { name: "Note", data: "note" },
        {
          name: "Paiement photo de classe",
          data: function (row, type, set, meta) {
            return row.paye ? "5,00 €" : "";
          },
        },
        {
          name: "A-t-il payé ?",
          data: function (row, type, set, meta) {
            return row.paye ? "Payé" : "Non payé";
          },
        },
        { name: "Mois paiement", data: "mois" },
        {
          name: '"Fonction SI pour le paiement"',
          data: function (row, type, set, meta) {
            return row.paye ? "Payé" : "Non payé";
          },
        },
        {
          name: '"Fonction SI pour la majorité"',
          data: function (row, type, set, meta) {
            return row.age >= 18 ? "Majeur" : "Mineur";
          },
        },
      ],
      rowCallback: function (row, data, displayNum, displayIndex, dataIndex) {
        //   var api = this.api();
        //   console.log(data.paye);
        $("td:eq(1)", row).addClass(
          "text-bg-" + (data.age >= 18 ? "success" : "danger")
        );
        $("td:eq(3)", row).html(createProgressBar(data.note));
        $("td:eq(4)", row).addClass(
          "text-bg-" + (data.paye ? "success" : "danger")
        );
        $("td:eq(5)", row).addClass(
          "text-bg-" + (data.paye ? "success" : "danger")
        );
        $("td:eq(7)", row).addClass(
          "text-bg-" + (data.paye ? "success" : "danger")
        );
        //   // Output the data for the visible rows to the browser's console
        //   console.log(api.colum({ page: "current" }).data());
      },
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

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function createProgressBar(data) {
  let level = "succcess";
  let icon = "bi bi-check-circle-fill";
  if (data < 8) {
    level = "danger";
    icon = "bi bi-x-circle-fill";
  } else if (data < 12) {
    level = "warning";
    icon = "bi bi-exclamation-circle-fill";
  }
  return `
    <div class="progress">
        <div class="progress-bar bg-${level} align-content-center" role="progressbar" style="width: ${
    (100 * data) / 20
  }%;" aria-valuenow="${data}" aria-valuemin="0" aria-valuemax="20">
  <i class="${icon}">${data}</i>
  </div>
 <i class="${icon} ${data !== 0 ? "d-none" : ""}">${data}</i>
    </div>

   
  `;
}
