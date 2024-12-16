let dataInput;
async function init() {
  try {
    dataInput = await fetch("/data/grossistes").then((res) => res.json());
    for (let index = 1; index <= dataInput.meta.pagination.total; index++) {
      document.querySelector("ul.nav-tabs").appendChild(
        document.createRange()
          .createContextualFragment(`<li class="nav-item" role="presentation">
                <a class="nav-link ${
                  index == 1 ? "active" : ""
                }" data-bs-toggle="tab" href="#tab${index}" aria-selected="true" role="tab">Cas ${index}</a>
            </li>`)
      );
      document.querySelector("#myTabContent").appendChild(
        document.createRange().createContextualFragment(
          `<div class="tab-pane ${
            index == 1 ? "show active" : "fade"
          }" id="tab${index}" role="tabpanel">
            <div id="cas${index}" class="d-flex"></div>
            ${showDataGrossiste(dataInput.data[index - 1])}
          </div>`
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
}

if (localStorage.token == undefined) {
  location.href = "/login";
} else {
  init();
}

function showDataGrossiste(params) {
  // Conditions de vente
  // Remise 1 : 2% de remise pour les grossistes
  // Remise 2 : 5% de remise pour les grossistes si le total 1 est supérieur à 10 000 €
  let remise1 = params.grossiste == true ? params.total * 0.02 : 0;
  let soustotal1 = params.total - remise1;
  let remise2 =
    params.grossiste == true && soustotal1 > 10000 ? soustotal1 * 0.05 : 0;
  let soustotal2 = soustotal1 - remise2;

  // Escompte : si le paiement s'effectue comptant
  // - 2% pour les détaillants
  // - 3% pour les grossistes
  let comptant =
    params.paiementcomptant == true
      ? params.grossiste == true
        ? soustotal2 * 0.02
        : soustotal2 * 0.03
      : 0;
  let totalHT = soustotal2 - comptant;
  let totalTVA = totalHT * (1 + params.TVA / 100);
  // Frais de port :  Ils s'élèvent à 50 €.
  // Ils ne sont pas facturés dans l'un OU l'autre des deux cas suivants  :
  // - si la VENTE est emportée
  // - si le total T.T.C. est supérieur à 15 000 €
  let fraisPort = (params.emportee == true || totalTVA > 15000) == true;

  return `<table id="infos" class="display table-bordered">
                            <thead>
                                <tr>
                                    <th colspan="3">RENSEIGNEMENTS DIVERS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Grossiste</th>
                                    <td></td>
                                    <td>${
                                      params.paiementcomptant == true
                                        ? "OUI"
                                        : "NON"
                                    }</td>
                                </tr>
                                <tr>
                                    <th scope="row">Paiement comptant</th>
                                    <td></td>
                                    <td>${
                                      params.grossiste == true ? "OUI" : "NON"
                                    }</td>
                                </tr>
                                <tr>
                                    <th scope="row">Vente emportée</th>
                                    <td></td>
                                    <td>${
                                      params.emportee == true ? "OUI" : "NON"
                                    }</td>
                                </tr>
                            </tbody>
                        </table>
                        <table id="total" class="display table-bordered">
                            <thead>
                                <tr>
                                    <th colspan="3">FACTURE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Marchandise HT</th>
                                    <td></td>
                                    <td>${params.total} €</td>
                                </tr>
                                <tr>
                                    <th scope="row">Remise 1</th>
                                    <td>${
                                      params.grossiste == true ? "OUI" : "NON"
                                    }</td>
                                    <td>${remise1.toFixed()}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Sous-total 1</th>
                                    <td></td>
                                    <td>${soustotal1.toFixed()} €</td>
                                </tr>
                                <tr>
                                    <th scope="row">Remise 2</th>
                                    <td>${
                                      params.grossiste == true ? "OUI" : "NON"
                                    }</td>
                                    <td>${remise2.toFixed()} €</td>
                                </tr>
                                
                                <tr>
                                    <th scope="row">Sous-total 2</th>
                                    <td></td>
                                    <td>${soustotal2.toFixed()} €</td>
                                </tr>
                                <tr>
                                    <th scope="row">Escompte</th>
                                    <td>${
                                      params.grossiste == true ? "OUI" : "NON"
                                    }</td>
                                    <td>${comptant.toFixed()} €</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total HT</th>
                                    <td></td>
                                    <td>${totalHT.toFixed()} €</td>
                                </tr>
                                <tr>
                                    <th scope="row">TVA</th>
                                    <td>${params.TVA} %</td>
                                    <td>${totalTVA.toFixed(2)} €</td>
                                </tr>
                                <tr>
                                    <th scope="row"></th>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th scope="row">FRAIS DE PORT</th>
                                    <td>${
                                      fraisPort == true ? "NON" : "OUI"
                                    }</td>
                                    <td>${fraisPort == true ? "-" : "50"} €</td>
                                </tr>
                            </tbody>
                        </table>`;
}
