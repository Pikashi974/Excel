async function init() {
  try {
    let data = await fetch("/data/exercices").then((res) => res.json());
    console.log(data);

    if (data && data.data && data.meta) {
      let listeOutput = document.querySelector("#exercicesList");
      data.data.forEach((obj) => {
        listeOutput.innerHTML += `
                    <div class="col">
                        <div class="card ${
                          obj.statut ? "border-success" : "border-danger"
                        } shadow-sm">
                            <img src="http://localhost:1337${
                              obj.thumbnail.url
                            }" alt="${obj.thumbnail.name}"/>
                            <div class="card-body">
                                <h5 class="card-title">${obj.nom}</h5>
                                <h6 class="card-subtitle text-muted">${
                                  obj.title
                                }</h6>
                                <p class="card-text">${obj.description}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick='location.href="${
                                          obj.link
                                        }"'>Voir</button>
                                    </div>
                                    <small class="text-body-secondary">${new Date(
                                      obj.updatedAt
                                    ).toLocaleString(
                                      luxon.DateTime.DATE_SHORT
                                    )}</small>
                                </div>
                            </div>
                        </div>
                    </div>`;
      });
    }
  } catch (error) {
    console.error(error);
  }
}
init();
/*

*/
