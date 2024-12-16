let dataInput;
async function init() {
  dataInput = await fetch("/data/salaries").then((res) => res.json());
  let nbQuestions = 12;
  for (let index = 1; index <= nbQuestions; index++) {
    document.querySelector("ul.nav-tabs").appendChild(
      document.createRange()
        .createContextualFragment(`<li class="nav-item" role="presentation">
                <a class="nav-link" data-bs-toggle="tab" href="#tab${index}" aria-selected="true" role="tab">Question ${index}</a>
            </li>`)
    );
    document.querySelector("#myTabContent").appendChild(
      document.createRange().createContextualFragment(
        `<div class="tab-pane fade" id="tab${index}" role="tabpanel">
            <div id="question${index}" class="d-flex"></div>
            <table id="output${index}" class="table-bordered w-100">
            </table>
          </div>`
      )
    );
  }

  let tableBDD = new DataTable("#liste", {
    ajax: {
      url: "/data/salaries",
      dataSrc: "data",
    },
    columns: [
      { name: "ID Salarié", data: "IDSalarie" },
      { name: "Nom", data: "nom" },
      { name: "Prénom", data: "prenom" },
      { name: "Sexe", data: "sexe" },
      { name: "Âge", data: "age" },
      {
        name: "Date d'intégration",
        type: "date",
        data: "integration",
        render: function (data, type, row) {
          return luxon.DateTime.fromISO(data).toFormat("dd/MM/yy");
        },
      },
      { name: "Qualification", data: "qualification" },
      { name: "Site", data: "site" },
      {
        name: "Salaire brut",
        data: "age",
        render: function (data, type, row) {
          return data + " €";
        },
      },
      { name: "Heures d'absence", data: "heuresAbsence" },
    ],
  });
  // Question 1
  let table1 = new DataTable("#output1", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeSite = [...new Set(data.map((element) => element.site))];
        return listeSite.map((element) => {
          let jsonOutput = {};

          jsonOutput["site"] = element;
          jsonOutput["heuresAbsence"] = data
            .filter((obj) => obj.site == element)
            .map((obj) => obj.heuresAbsence)
            .reduce((a, b) => a + b, 0);
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Site",
        data: "site",
        footer: "Total",
      },

      {
        title: "Total heures absence",
        data: "heuresAbsence",
        footer: "Total",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Total");
      $(api.column(1).footer()).html(
        data.map((obj) => obj.heuresAbsence).reduce((a, b) => a + b, 0)
      );
    },
  });
  // Question 2
  let table2 = new DataTable("#output2", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeSite = [
          ...new Set(data.map((element) => element.qualification)),
        ];
        return listeSite.map((element) => {
          let jsonOutput = {};
          jsonOutput["qualification"] = element;
          jsonOutput["salaireBrut"] = data
            .filter((obj) => obj.qualification == element)
            .map((obj) => obj.salaireBrut)
            .reduce((a, b) => a + b, 0);
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Qualification",
        data: "qualification",
        footer: "Total",
      },

      {
        title: "Total Salaire Brut",
        data: "salaireBrut",
        render: function (data, type, row) {
          return data.toFixed(2) + " €";
        },
        footer: "Total",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Total");
      $(api.column(1).footer()).html(
        `${data
          .map((obj) => obj.salaireBrut)
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} €`
      );
    },
  });
  // Question 3
  document.querySelector("#output3").outerHTML = `<div id="output3"></div>`;
  $("#output3").pivotUI(dataInput.data, {
    rows: ["sexe", "qualification"],
    vals: ["age"],
    aggregatorName: "Average",
  });
  document.querySelector("#output3 > table").classList.add("w-100");
  // Question 4
  document.querySelector("#output4").outerHTML = `<div id="output4"></div>`;
  $("#output4").pivot(dataInput.data, {
    rows: ["sexe"],
    cols: ["site"],
    aggregator: function (data, rowKey, colKey) {
      return {
        sum: 0,
        count: 0,
        push: function (record) {
          this.sum += record.salaireBrut;
          this.count++;
        },
        value: function () {
          return this.sum / this.count;
        },
        format: function (x) {
          return x.toFixed(2) + " €";
        },
      };
    },
    // cols: ["age"],
  });
  document.querySelector("#output4 > table").className = "table-bordered w-100";
  // GCD Question 4
  let graph4 = document.createElement("div");
  graph4.id = "graph4";
  document.querySelector("#tab4").appendChild(graph4);
  var options4 = {
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    series: [],
    labels: [],
    title: {
      text: "Moyenne des salaires selon le sexe et le site",
    },
    noData: {
      text: "Loading...",
    },
  };
  chart4 = new ApexCharts(document.querySelector("#graph4"), options4);
  chart4.render();
  await fetch("/data/salaries")
    .then((res) => res.json())
    .then(function (response) {
      let dataObj = response.data;
      let listeSite = [...new Set(dataObj.map((element) => element.site))];
      let listeSexe = [...new Set(dataObj.map((element) => element.sexe))];
      let seriesData = [];
      listeSexe.forEach((sexe) => {
        let jsonObj = {};
        jsonObj["name"] = sexe;
        let listeSalairesSexe = dataObj.filter(
          (element) => element.sexe == sexe
        );

        jsonObj["data"] = listeSite.map((site) => {
          return Number(
            listeSalairesSexe
              .filter((element) => element.site == site)
              .map((element) => element.salaireBrut)
              .reduce(function (avg, value, _, { length }) {
                return avg + value / length;
              }, 0)
              .toFixed(2)
          );
        });
        seriesData.push(jsonObj);
      });

      chart4.updateOptions({
        series: seriesData,
        labels: listeSite,
      });
    });
  // Question 5
  document.querySelector("#output5").outerHTML = `<div id="output5"></div>`;
  $("#output5").pivot(dataInput.data, {
    rows: ["qualification"],
    cols: ["sexe", "site"],
    aggregator: function (data, rowKey, colKey) {
      return {
        sum: 0,
        count: 0,
        push: function (record) {
          this.sum += record.heuresAbsence;
        },
        value: function () {
          return this.sum;
        },
        format: function (x) {
          return x;
        },
      };
    },
    // cols: ["age"],
  });
  document.querySelector("#output5 > table").className = "table-bordered w-100";
  // Question 6
  let dateMin = luxon.DateTime.fromJSDate(
    new Date(
      Math.min(
        ...dataInput.data.map((element) => new Date(element.integration))
      )
    )
  ).toFormat("yyyy-MM-dd");
  let dateMax = luxon.DateTime.fromJSDate(
    new Date(
      Math.max(
        ...dataInput.data.map((element) => new Date(element.integration))
      )
    )
  ).toFormat("yyyy-MM-dd");
  document.querySelector("#question6").appendChild(
    document.createRange().createContextualFragment(
      `<fieldset>
        <legend>Site:</legend>
        ${[
          ...new Set(
            dataInput.data.map(
              (element) =>
                `<div>
              <input type="checkbox" id="question6${element.site}" name="${element.site}" checked />
              <label for=question6${element.site}"  >${element.site}</label>
            </div>`
            )
          ),
        ].join("")}
      </fieldset>
      <fieldset>
        <legend>Période:</legend>
          <label for=dateMin>De:</label>
          <input type="date" name="dateMin" id="dateMin" min="${dateMin}" max="${dateMax}" value="${dateMin}" />
          <label for=dateMin>A:</label>
          <input type="date" name="dateMax" id="dateMax" min="${dateMin}" max="${dateMax}" value="${dateMax}" />
      </fieldset>`
    )
  );
  let table6 = new DataTable("#output6", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeSite = Array.from(
          document
            .querySelector("#question6")
            .querySelectorAll('input[type="checkbox"]:checked')
        ).map((element) => element.name);
        data = data.filter(
          (element) =>
            listeSite.includes(element.site) &&
            new Date(element.integration) >=
              new Date(document.querySelector("#dateMin").value) &&
            new Date(element.integration) <=
              new Date(document.querySelector("#dateMax").value)
        );
        let listeQualification = [
          ...new Set(data.map((element) => element.qualification)),
        ];
        return listeQualification.map((element) => {
          let jsonOutput = {};
          jsonOutput["qualification"] = element;
          jsonOutput["salaireBrut"] = data
            .filter((obj) => obj.qualification == element)
            .map((obj) => obj.salaireBrut)
            .reduce((a, b, _, { length }) => a + b / length, 0);
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Qualification",
        data: "qualification",
        footer: "Total",
      },

      {
        title: "Total Salaire Brut",
        data: "salaireBrut",
        render: function (data, type, row) {
          return data.toFixed(2) + " €";
        },
        footer: "Total",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Moyenne total");
      $(api.column(1).footer()).html(
        `${data
          .map((obj) => obj.salaireBrut)
          .reduce((a, b, _, { length }) => a + b / length, 0)
          .toFixed(2)} €`
      );
    },
  });
  document
    .querySelector("#question6")
    .querySelectorAll("input")
    .forEach((input) => {
      input.addEventListener("change", function () {
        table6.ajax.reload();
      });
    });
  // Question 7
  let table7 = new DataTable("#output7", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeAnnee = [
          ...new Set(
            data.map((element) => new Date(element.integration).getFullYear())
          ),
        ];
        return listeAnnee.map((element) => {
          let jsonOutput = {};
          jsonOutput["integration"] = element;
          jsonOutput["total"] = data.filter(
            (obj) => new Date(obj.integration).getFullYear() == element
          ).length;
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Année d'intégration",
        data: "integration",
        footer: "Total",
      },

      {
        title: "Nombre de salariés",
        data: "total",
        render: function (data, type, row) {
          return data;
        },
        footer: "Total",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Total salariés");
      $(api.column(1).footer()).html(
        `${data
          .map((obj) => obj.total)
          .reduce((a, b, _, { length }) => a + b, 0)}`
      );
    },
  });
  // Question 8
  let table8 = new DataTable("#output8", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeQualification = [
          ...new Set(data.map((element) => element.qualification)),
        ];
        return listeQualification.map((element) => {
          let jsonOutput = {};
          jsonOutput["qualification"] = element;
          jsonOutput["total"] =
            data.filter((obj) => obj.qualification == element).length /
            data.length;
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Qualification",
        data: "qualification",
        footer: "Total",
      },

      {
        title: "Pourcentage de salariés",
        data: "total",
        render: function (data, type, row) {
          return (data * 100).toFixed(2) + " %";
        },
        footer: "Total",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Total salariés");
      $(api.column(1).footer()).html(`100.00 %`);
    },
  });
  // Question 9
  let table9 = new DataTable("#output9", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeQualification = [
          ...new Set(data.map((element) => element.qualification)),
        ];
        let minSalaire = 20000;
        let maxSalaire = 100000;
        let tranche = 5000;
        let listeTranches = ["< " + minSalaire];
        for (let index = minSalaire; index < maxSalaire; index += tranche) {
          listeTranches.push(
            index +
              " - " +
              (index + tranche < maxSalaire ? index + tranche - 1 : maxSalaire)
          );
        }
        listeTranches.push(">" + maxSalaire);

        return listeTranches.map((element, index) => {
          let jsonOutput = {};
          jsonOutput["tranche"] = element;
          listeQualification.forEach((elem) => {
            let key = elem.toLowerCase();
            jsonOutput[key] = [0, listeTranches.length - 1].includes(index)
              ? index == 0
                ? data
                    .filter((obj) => obj.qualification == elem)
                    .filter((obj) => obj.salaireBrut < minSalaire).length
                : data
                    .filter((obj) => obj.qualification == elem)
                    .filter((obj) => obj.salaireBrut > maxSalaire).length
              : data
                  .filter((obj) => obj.qualification == elem)
                  .filter(
                    (obj) =>
                      obj.salaireBrut >= minSalaire + (index - 1) * tranche &&
                      obj.salaireBrut < minSalaire + index * tranche
                  ).length +
                (minSalaire + index * tranche < maxSalaire
                  ? 0
                  : data
                      .filter((obj) => obj.qualification == elem)
                      .filter((obj) => obj.salaireBrut == maxSalaire).length);
          });

          jsonOutput["total"] = [0, listeTranches.length - 1].includes(index)
            ? index == 0
              ? data.filter((obj) => obj.salaireBrut < minSalaire).length
              : data.filter((obj) => obj.salaireBrut > maxSalaire).length
            : data.filter(
                (obj) =>
                  obj.salaireBrut >= minSalaire + (index - 1) * tranche &&
                  obj.salaireBrut < minSalaire + index * tranche
              ).length +
              (minSalaire + index * tranche < maxSalaire
                ? 0
                : data.filter((obj) => obj.salaireBrut == maxSalaire).length);
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Tranche de salaires",
        data: "tranche",
        footer: "Total",
      },
    ]
      .concat(
        [
          ...new Set(dataInput.data.map((element) => element.qualification)),
        ].map((element) => {
          return {
            title: element,
            data: element.toLowerCase(),
            footer: "",
          };
        })
      )
      .concat({
        title: "Nombre de salariés",
        data: "total",
        render: function (data, type, row) {
          return data;
        },
        footer: "Total",
      }),

    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Total salariés");
      let listeQualification = [
        ...new Set(dataInput.data.map((element) => element.qualification)),
      ];
      for (let index = 0; index < listeQualification.length; index++) {
        let key = listeQualification[index].toLowerCase();
        $(api.column(index + 1).footer()).html(
          `${data.map((obj) => obj[key]).reduce((a, b) => a + b, 0)}`
        );
      }

      $(api.column(api.columns.length - 1).footer()).html(
        `${data
          .map((obj) => obj.total)
          .reduce((a, b, _, { length }) => a + b, 0)}`
      );
    },
    pageLength: 50,
  });
  // Question 10
  document.querySelector("#output10").outerHTML = `<div id="output10">
  <fieldset>
        <legend>Qualification:</legend>
        ${[
          ...new Set(
            dataInput.data.map(
              (element) =>
                `<div>
              <input type="checkbox" id="question11${element.qualification}" name="${element.qualification}" checked />
              <label for=question11${element.qualification}"  >${element.qualification}</label>
            </div>`
            )
          ),
        ].join("")}
      </fieldset>
      <div id="output1Card10"></div>
  </div>`;
  $("#output1Card10").pivotUI(
    dataInput.data.map((element) => {
      let jsonOutput = {};
      let minAge = 15;
      let maxAge = 75;
      let tranche = 10;
      let ageRange = element.age < minAge ? "< " + minAge : "> " + maxAge;
      for (let index = minAge; index < maxAge + 1; index += tranche) {
        if (element.age >= index && element.age < index + tranche) {
          ageRange =
            index +
            " - " +
            (index + tranche < maxAge ? index + tranche - 1 : maxAge);
        }
      }

      jsonOutput["sexe"] = element.sexe;
      jsonOutput["site"] = element.site;
      jsonOutput["qualification"] = element.qualification;
      jsonOutput["heuresAbsence"] = element.heuresAbsence;
      jsonOutput["age"] = ageRange;
      return jsonOutput;
    }),
    {
      rows: ["sexe", "site"],
      cols: ["heuresAbsence", "age"],
      vals: ["heuresAbsence", "age"],
      aggregatorName: "Count",
      // aggregator: function (data, rowKey, colKey) {
      //   return {
      //     sum: 0,
      //     count: 0,
      //     push: function (record) {
      //       this.sum += record.age;
      //       this.count++;
      //     },
      //     value: function () {
      //       return this.sum / this.count;
      //     },
      //     format: function (x) {
      //       return x;
      //     },
      //   };
      // },
      // cols: ["age"],
    }
  );

  document
    .querySelector("#output10")
    .querySelector("fieldset")
    .querySelectorAll("input")
    .forEach((input) => {
      input.addEventListener("change", function () {
        let liste10 = Array.from(
          document
            .querySelector("#output10")
            .querySelector("fieldset")
            .querySelectorAll("input[type=checkbox]:checked")
        ).map((element) => element.name);
        $("#output1Card10").pivotUI(
          dataInput.data
            .filter((element) => liste10.includes(element.qualification))
            .map((element) => {
              let jsonOutput = {};
              let minAge = 15;
              let maxAge = 75;
              let tranche = 10;
              let ageRange =
                element.age < minAge ? "< " + minAge : "> " + maxAge;
              for (let index = minAge; index < maxAge + 1; index += tranche) {
                if (element.age >= index && element.age < index + tranche) {
                  ageRange =
                    index +
                    " - " +
                    (index + tranche < maxAge ? index + tranche - 1 : maxAge);
                }
              }

              jsonOutput["sexe"] = element.sexe;
              jsonOutput["site"] = element.site;
              jsonOutput["qualification"] = element.qualification;
              jsonOutput["heuresAbsence"] = element.heuresAbsence;
              jsonOutput["age"] = ageRange;
              return jsonOutput;
            }),
          {
            rows: ["sexe", "site"],
            cols: ["heuresAbsence", "age"],
            vals: ["heuresAbsence", "age"],
            aggregatorName: "Count",
          }
        );
      });
    });

  // Question 11
  document.querySelector("#output11").outerHTML = `<div id="output11">
    <fieldset>
        <legend>Qualification:</legend>
        ${[
          ...new Set(
            dataInput.data.map(
              (element) =>
                `<div>
              <input type="checkbox" id="question11${element.qualification}" name="${element.qualification}" checked />
              <label for=question11${element.qualification}"  >${element.qualification}</label>
            </div>`
            )
          ),
        ].join("")}
      </fieldset>
      <div class="d-flex">
        <div id="output1Card11"></div><div id="output2Card11"></div>
      </div>
  </div>`;

  $("#output1Card11").pivotUI(
    dataInput.data.map((element) => {
      let jsonOutput = {};
      let minAge = 15;
      let maxAge = 75;
      let tranche = 10;
      let ageRange = element.age < minAge ? "< " + minAge : "> " + maxAge;
      for (let index = minAge; index < maxAge + 1; index += tranche) {
        if (element.age >= index && element.age < index + tranche) {
          ageRange =
            index +
            " - " +
            (index + tranche < maxAge ? index + tranche - 1 : maxAge);
        }
      }

      jsonOutput["sexe"] = element.sexe;
      jsonOutput["site"] = element.site;
      jsonOutput["qualification"] = element.qualification;
      jsonOutput["age"] = ageRange;
      return jsonOutput;
    }),
    {
      rows: ["sexe", "site"],
      cols: ["age"],
      vals: ["age"],
      aggregatorName: "Count",
    },
    true
  );
  $("#output2Card11").pivotUI(
    dataInput.data.map((element) => {
      let jsonOutput = {};
      let minAge = 15;
      let maxAge = 75;
      let tranche = 10;
      let ageRange = element.age < minAge ? "< " + minAge : "> " + maxAge;
      for (let index = minAge; index < maxAge + 1; index += tranche) {
        if (element.age >= index && element.age < index + tranche) {
          ageRange =
            index +
            " - " +
            (index + tranche < maxAge ? index + tranche - 1 : maxAge);
        }
      }

      jsonOutput["sexe"] = element.sexe;
      jsonOutput["site"] = element.site;
      jsonOutput["qualification"] = element.qualification;
      jsonOutput["heuresAbsence"] = element.heuresAbsence;
      return jsonOutput;
    }),
    {
      rows: ["sexe", "site"],
      cols: ["heuresAbsence"],
      vals: ["heuresAbsence"],
      aggregatorName: "Count",
    },
    true
  );

  document
    .querySelector("#output11")
    .querySelector("fieldset")
    .querySelectorAll("input")
    .forEach((input) => {
      input.addEventListener("change", function () {
        liste11 = Array.from(
          document
            .querySelector("#output11")
            .querySelector("fieldset")
            .querySelectorAll("input[type=checkbox]:checked")
        ).map((element) => element.name);
        $("#output1Card11").pivotUI(
          dataInput.data
            .filter((element) => liste11.includes(element.qualification))
            .map((element) => {
              let jsonOutput = {};
              let minAge = 15;
              let maxAge = 75;
              let tranche = 10;
              let ageRange =
                element.age < minAge ? "< " + minAge : "> " + maxAge;
              for (let index = minAge; index < maxAge + 1; index += tranche) {
                if (element.age >= index && element.age < index + tranche) {
                  ageRange =
                    index +
                    " - " +
                    (index + tranche < maxAge ? index + tranche - 1 : maxAge);
                }
              }

              jsonOutput["sexe"] = element.sexe;
              jsonOutput["site"] = element.site;
              jsonOutput["qualification"] = element.qualification;
              jsonOutput["age"] = ageRange;
              return jsonOutput;
            }),
          {
            rows: ["sexe", "site"],
            cols: ["age"],
            vals: ["age"],
            aggregatorName: "Count",
          },
          true
        );
        $("#output2Card11").pivotUI(
          dataInput.data
            .filter((element) => liste11.includes(element.qualification))
            .map((element) => {
              let jsonOutput = {};
              let minAge = 15;
              let maxAge = 75;
              let tranche = 10;
              let ageRange =
                element.age < minAge ? "< " + minAge : "> " + maxAge;
              for (let index = minAge; index < maxAge + 1; index += tranche) {
                if (element.age >= index && element.age < index + tranche) {
                  ageRange =
                    index +
                    " - " +
                    (index + tranche < maxAge ? index + tranche - 1 : maxAge);
                }
              }

              jsonOutput["sexe"] = element.sexe;
              jsonOutput["site"] = element.site;
              jsonOutput["qualification"] = element.qualification;
              jsonOutput["heuresAbsence"] = element.heuresAbsence;
              return jsonOutput;
            }),
          {
            rows: ["sexe", "site"],
            cols: ["heuresAbsence"],
            vals: ["heuresAbsence"],
            aggregatorName: "Count",
          },
          true
        );
      });
    });
  // Question 12
  let table12 = new DataTable("#output12", {
    ajax: {
      url: "/data/salaries",
      dataSrc: function (json) {
        let data = json.data;
        let listeSite = [...new Set(data.map((element) => element.sexe))];
        return listeSite.map((element) => {
          let jsonOutput = {};
          jsonOutput["sexe"] = element;
          jsonOutput["salaireBrut"] = data
            .filter((obj) => obj.sexe == element)
            .map((obj) => obj.salaireBrut)
            .reduce((a, b) => a + b, 0);
          return jsonOutput;
        });
      },
    },
    columns: [
      {
        title: "Sexe",
        data: "sexe",
        footer: "Total",
      },

      {
        title: "Total Salaire Brut",
        data: "salaireBrut",
        render: function (data, type, row) {
          return data.toFixed(2) + " €";
        },
        footer: "Total",
      },
      {
        title: "Total Salaire Brut +10%",
        data: "salaireBrut",
        render: function (data, type, row) {
          return (data * 1.1).toFixed(2) + " €";
        },
        footer: "Total",
      },
    ],
    footerCallback: function (tr, data, start, end, display) {
      var api = this.api();
      $(api.column(0).footer()).html("Total");
      $(api.column(1).footer()).html(
        `${data
          .map((obj) => obj.salaireBrut)
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} €`
      );
      $(api.column(2).footer()).html(
        `${data
          .map((obj) => 1.1 * obj.salaireBrut)
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} €`
      );
    },
    pageLength: 50,
  });
}
init();
function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
