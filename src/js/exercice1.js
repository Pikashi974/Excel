// const { default: DataTable } = require("datatables.net-bs5");

let chart;
async function init() {
  let tableTotal = new DataTable("#total", {
    ajax: {
      url: "/data/produits",
      dataSrc: "data",
    },
    columns: [
      { data: "nom" },
      { data: "achat" },
      { data: "ventes" },
      {
        data: function (row, type, val, meta) {
          return row.achat + row.ventes;
        },
        render: function (data, type, row) {
          return data;
        },
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      for (let index = 1; index < 4; index++) {
        $(api.column(index).footer()).html(
          Number(
            api
              .column(index)
              .data()
              .reduce(function (a, b) {
                return a + b;
              }, 0)
          ).toFixed(0)
        );
      }
    },
  });
  let tableMoyenne = new DataTable("#moyenne", {
    ajax: {
      url: "/data/produits",
      dataSrc: "data",
    },
    columns: [
      { data: "nom" },
      { data: "ventes" },
      {
        data: "prix",
        render: function (data, type, row) {
          return data + " €";
        },
      },
      {
        data: function (row, type, val, meta) {
          return row.prix * row.ventes;
        },
        render: function (data, type, row) {
          return data + " €";
        },
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(1).footer()).html(
        Number(
          api
            .column(1)
            .data()
            .reduce(function (a, b) {
              return a + b / end;
            }, 0)
        ).toFixed(1)
      );

      for (let index = 2; index < 4; index++) {
        $(api.column(index).footer()).html(
          Number(
            api
              .column(index)
              .data()
              .reduce(function (a, b) {
                return a + b / end;
              }, 0)
          ).toFixed(2) + " €"
        );
      }
    },
  });

  //   let dataPays = await fetch("/data/pays2").then((res) => res.json());
  //   let number = dataPays.data.map((obj) => obj.ca).reduce((a, b) => a + b, 0);
  let tablePays = new DataTable("#pays", {
    ajax: {
      url: "/data/pays2",
      dataSrc: "data",
    },
    columns: [
      { data: "nom" },
      {
        data: "ca",
        render: function (data, type, row) {
          return data + " €";
        },
      },
      {
        // data: "ca",
        data: function (row, type, set, meta) {
          let total = meta.settings.aoData
            .map((element) => element._aData.ca)
            .reduce((a, b) => a + b, 0);
          return row.ca / total;
        },
        render: function (data, type, row) {
          return (data * 100).toFixed(2) + " %";
        },
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(1).footer()).html(
        Number(
          api
            .column(1)
            .data()
            .reduce(function (a, b) {
              return a + b;
            }, 0)
        ).toFixed(2) + " €"
      );
      $(api.column(2).footer()).html("100.00 %");
    },
  });
  var options = {
    chart: {
      height: 350,
      type: "pie",
    },
    dataLabels: {
      enabled: false,
    },
    series: [],
    labels: [],
    title: {
      text: "Chiffre d'affaire",
    },
    noData: {
      text: "Loading...",
    },
  };

  chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();

  await fetch("/data/pays2")
    .then((res) => res.json())
    .then(function (response) {
      let dataRes = response.data.map((obj) => obj.ca);
      let labRes = response.data.map((obj) => obj.nom);

      chart.updateOptions({
        series: dataRes,
        labels: labRes,
      });
    });
}

init();
