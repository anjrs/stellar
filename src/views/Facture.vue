<script>
import axios from "axios"
import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      facture: null, // Détails de la facture
      commandeId: null // ID de la commande récupérée depuis le localStorage
    };
  },
  mounted() {
    this.getFirstFactureDetails(); // Appeler la méthode dès que le composant est monté
  },
  methods: {
    async getFirstFactureDetails() {
      try {
        // Récupérer les commandes facturées depuis le localStorage
        const facturedOrders = JSON.parse(localStorage.getItem("facturedOrders"));

        if (!facturedOrders || facturedOrders.length === 0) {
          console.error("Aucune commande facturée trouvée dans le localStorage.");
          return;
        }

        // Obtenir l'ID de la première commande facturée
        const firstFacturedOrderId = facturedOrders[0];
        console.log("ID de la première commande facturée :", firstFacturedOrderId);

        // Effectuer une requête pour récupérer les détails de la facture
        const response = await axios.get(
          `http://localhost:7979/dolibarr/htdocs/api/index.php/orders/${firstFacturedOrderId}`,
          {
            headers: {
              DOLAPIKEY: "8a8MsnQGo371to4oVLWk552rIhNUFIt8",
              Accept: "application/json"
            }
          }
        );

        // Stocker les détails de la facture
        this.facture = response.data;
        this.commandeId = firstFacturedOrderId;
        console.log("Détails de la facture récupérés :", this.facture);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la facture :", error);
      }
    },
    exportToPDF() {
      const element = this.$refs.document; // Récupérer l'élément HTML via la référence
      const options = {
        margin: 1,
        filename: `Facture_${this.commandeId || "inconnue"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" }
      };

      html2pdf().set(options).from(element).save();
    }
  }
};
</script>

<template>
  <div class="container" ref="document">
    <div class="element-to-convert">
      <div class="header">
        <h1>Facture</h1>
        <p><strong>Référence client :</strong> {{ facture?.ref_client || "Non disponible" }}</p>
        <p><strong>Date de commande :</strong> {{ facture?.date || "Non disponible" }}</p>
      </div>

      <div class="corps">
        <table border="1">
          <thead>
            <tr>
              <th>Désignation</th>
              <th>TVA</th>
              <th>P.U HT</th>
              <th>Quantité</th>
              <th>Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ligne in facture?.lines || []" :key="ligne.id">
              <td>{{ ligne.desc }}</td>
              <td>{{ ligne.tva_tx }}%</td>
              <td>{{ ligne.subprice }}</td>
              <td>{{ ligne.qty }}</td>
              <td>{{ ligne.total_ht }}</td>
            </tr>
          </tbody>
        </table>
        <div class="totaux">
          <p><strong>Total HT :</strong> {{ facture?.total_ht || "0.00" }} €</p>
          <p><strong>Total TVA :</strong> {{ facture?.total_tva || "0.00" }} €</p>
          <p><strong>Total TTC :</strong> {{ facture?.total_ttc || "0.00" }} €</p>
        </div>
      </div>

      <button @click="exportToPDF">Télécharger la facture</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.corps table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.corps th, .corps td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

.totaux {
  margin-top: 20px;
  text-align: right;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>