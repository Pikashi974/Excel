async function init() {
  try {
    let dataCategories = await fetch("/data/categorie-coureurs").then((res) =>
      res.json()
    );
    dataCategories = dataCategories.data;
    let dataCourses = await fetch("/data/course-prixes").then((res) =>
      res.json()
    );
    dataCourses = dataCourses.data;
    console.log(dataCourses);

    let tableTotal = new DataTable("#total", {
      ajax: {
        url: "/data/coureurs",
        dataSrc: "data",
      },
      columns: [
        {
          title: "Nom",
          data: "nom",
        },
        {
          title: "Prénom",
          data: "prenom",
        },
        {
          title: "Sexe",
          data: "sexe",
        },
        {
          title: "Date de naissance",
          data: "datenaissance",
          render: function (data, type, row) {
            return luxon.DateTime.fromJSDate(new Date(data)).toFormat(
              "dd/MM/yyyy"
            );
          },
        },
        {
          title: "Catégorie",
          data: "datenaissance",
          render: function (data, type, row) {
            return dataCategories.find(
              (element) => element.annee == new Date(data).getFullYear()
            ).categorie;
          },
        },
        {
          title: "Taille tee-shirt",
          data: "tshirt",
        },
        {
          title: "Course",
          data: "course",
        },
        {
          title: "Prix club",
          data: function (row, type, val, meta) {
            let nbCoureurs = meta.settings.aoData.filter(
              (element) => element._aData.course == row.course
            ).length;
            let course = dataCourses.find(
              (element) => element.nom == row.course
            );
            return nbCoureurs >= 9 ? course.prix15 : course.prix20;
          },
          render: function (data, type, row) {
            return data.toFixed(2) + " €";
          },
        },
        {
          title: "Repas avant course",
          data: "repasavant",
          render: function (data, type, row) {
            return data == true ? "OUI" : "NON";
          },
        },
        {
          title: "Prix du repas avant course",
          data: function (row, type, val, meta) {
            return row.repasavant ? 8 : 0;
          },
          render: function (data, type, row) {
            return data.toFixed(2) + " €";
          },
        },
        {
          title: "Repas apres course",
          data: "repasapres",
          render: function (data, type, row) {
            return data == true ? "OUI" : "NON";
          },
        },
        {
          title: "Prix du repas apres course",
          data: function (row, type, val, meta) {
            return row.repasapres ? 10 : 0;
          },
          render: function (data, type, row) {
            return data.toFixed(2) + " €";
          },
        },
        {
          title: "Total coureur",
          data: function (row, type, val, meta) {
            let nbCoureurs = meta.settings.aoData.filter(
              (element) => element._aData.course == row.course
            ).length;
            let course = dataCourses.find(
              (element) => element.nom == row.course
            );
            return (
              (nbCoureurs >= 9 ? course.prix15 : course.prix20) +
              (row.repasavant ? 8 : 0) +
              (row.repasapres ? 10 : 0)
            );
          },
          render: function (data, type, row) {
            return data.toFixed(2) + " €";
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
  } catch (error) {
    console.error(error);
  }
}

if (localStorage.token == undefined) {
  location.href = "/login";
} else {
  init();
}
