<template>
  <div class="dashboard-container">
    <h1>Tableau de Bord</h1>

    <!-- Total de vente -->
    <div class="infoGeneral">
      <div class="card total-vente">
        <h2>Total des Ventes</h2>
        <p>{{ formatCurrency(totalVente) }}</p>
      </div>

      <div class="card commandes-en-attente">
        <h2>Commandes en Attente</h2>
        <p>{{ commandesEnAttente.length }}</p>
      </div>

      <div class="card taux-conversion">
        <h2>Taux de Conversion</h2>
        <p>{{ ((commandesPayees.length / (commandesPayees.length + commandesEnAttente.length)) * 100).toFixed(2) }}%</p>
      </div>
    </div>
    
    <!-- Vente par catégorie -->
    <div class="categorie">
      <!-- Circulaire -->
      <div class="chart-container">
        <h2>Vente par Catégorie</h2>
        <canvas id="venteCategorieChart"></canvas>
      </div>
      <!-- Liste des catégories avec les barres -->
      <div class="categories-list">
        <h2>Liste des Catégories</h2>
        <ul>
          <li v-for="categorie in venteParCategorie" :key="categorie.label">
            <span>{{ categorie.label }}</span>
            <span>{{ formatCurrency(categorie.value) }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Évolution des ventes -->
    <div class="chart-container">
      <h2>Évolution des Ventes</h2>
      <canvas id="evolutionVenteChart"></canvas>
    </div>

    <!-- Statut des commandes -->
    <div class="chart-container">
      <h2>Statut des Commandes</h2>
      <canvas id="statusCommandeChart"></canvas>
    </div>

    <!-- Top des produits vendus -->
    <div class="chart-container">
      <h2>Top des Produits Vendus</h2>
      <canvas id="topProduitsChart"></canvas>
    </div>

    <!-- Liste des commandes payées -->
    <div class="table-container">
      <h2>Commandes Payées</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Produit</th>
            <th>Référence</th>
            <th>Catégorie</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Statut</th>
            <th>N° Facture</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commande in commandesPayees" :key="commande.id">
            <td>{{ formatDate(commande.date) }}</td>
            <td>{{ commande.client }}</td>
            <td>{{ commande.produit }}</td>
            <td>{{ commande.reference }}</td>
            <td>{{ commande.categorie }}</td>
            <td>{{ commande.quantite }}</td>
            <td>{{ formatCurrency(commande.total) }}</td>
            <td>{{ commande.status }}</td>
            <td>{{ commande.facture }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Liste des commandes en attente -->
    <div class="table-container">
      <h2>Commandes en Attente</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Produit</th>
            <th>Référence</th>
            <th>Catégorie</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Statut</th>
            <th>N° Facture</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commande in commandesEnAttente" :key="commande.id">
            <td>{{ formatDate(commande.date) }}</td>
            <td>{{ commande.client }}</td>
            <td>{{ commande.produit }}</td>
            <td>{{ commande.reference }}</td>
            <td>{{ commande.categorie }}</td>
            <td>{{ commande.quantite }}</td>
            <td>{{ formatCurrency(commande.total) }}</td>
            <td>{{ commande.status }}</td>
            <td>{{ commande.facture }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  data() {
    return {
      totalVente: 0,
      commandesPayees: [],
      commandesEnAttente: [],
      venteParCategorie: [],
      evolutionVente: [],
      statusCommande: [],
      topProduits: [],
      isLoading: true,
      error: null
    };
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      try {
        this.isLoading = true;
        
        // Configuration de l'API Dolibarr
        const API_KEY = "8a8MsnQGo371to4oVLWk552rIhNUFIt8";
        const API_URL = "http://localhost:7979/dolibarr/htdocs/api/index.php";
        const headers = {
          DOLAPIKEY: API_KEY,
          Accept: "application/json"
        };
        
        // Récupération des données en parallèle pour améliorer les performances
        const [commandesResponse, produitsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_URL}/orders?limit=100&sortfield=date_creation&sortorder=DESC`, { headers }),
          axios.get(`${API_URL}/products?limit=100`, { headers }),
          axios.get(`${API_URL}/categories?type=product&limit=100`, { headers }),
          
        ]);

        // Récupération des informations détaillées des commandes pour avoir les lignes de commande
        const commandes = commandesResponse.data;
        const produits = produitsResponse.data;
        const categories = categoriesResponse.data;
        
        // Map pour stocker les noms de catégories par ID
        const categoriesMap = {};
        if (Array.isArray(categories)) {
          categories.forEach(cat => {
            categoriesMap[cat.id] = cat.label || cat.ref || `Catégorie ${cat.label}`;
          });
        }
        
        // Récupérer les détails des commandes (pour avoir les lignes)
        const commandesDetaillees = [];
        for (const commande of commandes.slice(0, 30)) { // Limiter à 30 pour éviter trop de requêtes
          try {
            const detailResponse = await axios.get(`${API_URL}/orders/${commande.id}`, { headers });
            if (detailResponse.data) {
              commandesDetaillees.push({
                ...commande,
                lines: detailResponse.data.lines || []
              });
            }
          } catch (e) {
            console.warn(`Impossible de récupérer les détails de la commande ${commande.id}:`, e);
          }
        }

        // Map des produits pour accès rapide
        const produitsMap = {};
        if (Array.isArray(produits)) {
          produits.forEach(produit => {
            produitsMap[produit.id] = {
              label: produit.label || produit.ref,
              categorieId: produit.array_options?.options_categorie || produit.fk_product_type || 0
            };
          });
        }

        // Traiter les commandes
        // Calculer le total des ventes
        this.totalVente = commandesDetaillees.reduce((sum, commande) => {
          return sum + parseFloat(commande.total_ttc || 0);
        }, 0);

        // Filtrer les commandes par statut
        // Dans Dolibarr: 0=brouillon, 1=validée, 2=en cours, 3=livrée, -1=annulée
        this.commandesPayees = commandesDetaillees.filter(commande => 
          commande.billed === "1" || commande.status === "3" || commande.status === "1");
        this.commandesEnAttente = commandesDetaillees.filter(commande => 
          commande.billed !== "1" && commande.status !== "3" && commande.status !== "-1");

        // Transformer les commandes pour l'affichage
        this.commandesPayees = this.transformCommandesForDisplay(this.commandesPayees, produitsMap, categoriesMap);
        this.commandesEnAttente = this.transformCommandesForDisplay(this.commandesEnAttente, produitsMap, categoriesMap);

        // Calculer les ventes par catégorie
        this.venteParCategorie = this.calculateVenteParCategorie(commandesDetaillees, produitsMap, categoriesMap);

        // Calculer l'évolution des ventes
        this.evolutionVente = this.calculateEvolutionVente(commandesDetaillees);

        // Calculer le statut des commandes
        this.statusCommande = this.calculateStatusCommande(commandesDetaillees);

        // Top des produits vendus
        this.topProduits = this.calculateTopProduits(commandesDetaillees, produitsMap);

        // Initialiser les graphiques
        this.$nextTick(() => {
          this.initCharts();
        });
        
        this.isLoading = false;
      } catch (error) {
        console.error("Erreur lors de la récupération des données du tableau de bord :", error);
        this.error = "Erreur lors du chargement des données";
        this.isLoading = false;
      }
    },
    
    transformCommandesForDisplay(commandes, produitsMap, categoriesMap) {
      return commandes.map(commande => {
        // Trouver le premier produit de la commande pour l'affichage
        const firstLine = commande.lines && commande.lines.length > 0 ? commande.lines[0] : null;
        const produitId = firstLine ? firstLine.fk_product : null;
        const produit = produitId && produitsMap[produitId] ? produitsMap[produitId] : null;
        
        // Statut de la commande
        let status = "Inconnu";
        switch (commande.status) {
          case "-1": status = "Annulée"; break;
          case "0": status = "Brouillon"; break;
          case "1": status = "Validée"; break;
          case "2": status = "En cours"; break;
          case "3": status = "Livrée"; break;
        }
        
        // Ajout d'info "Payée" si c'est le cas
        if (commande.billed === "1") {
          status += " (Payée)";
        }
        
        return {
          id: commande.id,
          date: commande.date_creation || commande.date_commande,
          client: commande.socnom || `Client ${commande.socid}`,
          produit: produit ? produit.label : "Produit inconnu",
          reference: commande.ref || "-",
          categorie: produit && produit.categorieId && categoriesMap[produit.categorieId] 
            ? categoriesMap[produit.categorieId] 
            : "Non catégorisé",
          quantite: firstLine ? firstLine.qty : 0,
          total: commande.total_ttc,
          status: status,
          facture: commande.billed === "1" ? commande.ref_client || "Facturée" : "-"
        };
      });
    },
    
    calculateVenteParCategorie(commandes, produitsMap, categoriesMap) {
      const categories = {};

      commandes.forEach(commande => {
        if (!commande.lines || !Array.isArray(commande.lines)) return;
        
        commande.lines.forEach(line => {
          if (!line.fk_product) return;
          
          const produit = produitsMap[line.fk_product];
          if (!produit) return;
          
          const categorieId = produit.categorieId;
          const categorieName = categoriesMap[categorieId] || "Autres";
          
          if (!categories[categorieName]) {
            categories[categorieName] = 0;
          }
          
          // Multiplier le prix unitaire par la quantité
          const montant = parseFloat(line.total_ttc || line.price * line.qty || 0);
          categories[categorieName] += montant;
        });
      });

      // Transformer en tableau et trier par valeur décroissante
      return Object.entries(categories)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
    },
    
    calculateEvolutionVente(commandes) {
      const ventesParMois = {};
      const dateFormat = { year: 'numeric', month: 'short' };

      commandes.forEach(commande => {
        const date = new Date(commande.date_creation * 1000);
        const moisAnnee = date.toLocaleDateString('fr-FR', dateFormat);
        
        if (!ventesParMois[moisAnnee]) {
          ventesParMois[moisAnnee] = 0;
        }
        
        ventesParMois[moisAnnee] += parseFloat(commande.total_ttc || 0);
      });

      // Trier par date (transformer en objet avec date pour pouvoir trier)
      const result = Object.entries(ventesParMois)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => {
          const dateA = new Date(a.date.replace(/^\S+\s+/, ''));
          const dateB = new Date(b.date.replace(/^\S+\s+/, ''));
          return dateA - dateB;
        });
        
      return result;
    },
    
    calculateStatusCommande(commandes) {
      const statusLabels = {
        "-1": "Annulée",
        "0": "Brouillon",
        "1": "Validée",
        "2": "En cours",
        "3": "Livrée"
      };
      
      const statusCounts = {};

      commandes.forEach(commande => {
        const status = statusLabels[commande.status] || "Inconnu";
        
        if (!statusCounts[status]) {
          statusCounts[status] = 0;
        }
        
        statusCounts[status]++;
      });

      return Object.entries(statusCounts)
        .map(([label, value]) => ({ label, value }));
    },
    
    calculateTopProduits(commandes, produitsMap) {
      const produitsCounts = {};

      commandes.forEach(commande => {
        if (!commande.lines || !Array.isArray(commande.lines)) return;
        
        commande.lines.forEach(line => {
          if (!line.fk_product) return;
          
          const produitId = line.fk_product;
          const produit = produitsMap[produitId];
          const produitName = produit ? produit.label : `Produit ${produitId}`;
          
          if (!produitsCounts[produitName]) {
            produitsCounts[produitName] = 0;
          }
          
          produitsCounts[produitName] += parseInt(line.qty || 0);
        });
      });

      // Transformer en tableau, trier et prendre les 5 premiers
      return Object.entries(produitsCounts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
    
    initCharts() {
      // Détruire les charts existants pour éviter les doublons
      Chart.getChart("venteCategorieChart")?.destroy();
      Chart.getChart("evolutionVenteChart")?.destroy();
      Chart.getChart("statusCommandeChart")?.destroy();
      Chart.getChart("topProduitsChart")?.destroy();
      
      // Couleurs personnalisées pour les graphiques
      const chartColors = ['#B1FF36', '#8FE023', '#6FBD09', '#568A0B', '#3D6007', '#5CFF36', '#36FF8F', '#36CAFF'];
      
      // Vente par catégorie
      new Chart(document.getElementById("venteCategorieChart"), {
        type: "doughnut",
        data: {
          labels: this.venteParCategorie.map(categorie => categorie.label),
          datasets: [
            {
              data: this.venteParCategorie.map(categorie => categorie.value),
              backgroundColor: chartColors,
              borderColor: "#121212",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'white'
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${this.formatCurrency(value)}`;
                }
              }
            }
          }
        }
      });

      // Évolution des ventes
      new Chart(document.getElementById("evolutionVenteChart"), {
        type: "bar",
        data: {
          labels: this.evolutionVente.map(vente => vente.date),
          datasets: [
            {
              label: "Ventes",
              data: this.evolutionVente.map(vente => vente.value),
              backgroundColor: "#B1FF36",
              borderColor: "#91DF16",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white',
                callback: (value) => this.formatCurrency(value)
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: 'white'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Ventes: ${this.formatCurrency(context.raw)}`;
                }
              }
            }
          }
        }
      });

      // Statut des commandes
      new Chart(document.getElementById("statusCommandeChart"), {
        type: "doughnut",
        data: {
          labels: this.statusCommande.map(status => status.label),
          datasets: [
            {
              data: this.statusCommande.map(status => status.value),
              backgroundColor: chartColors,
              borderColor: "#121212",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'white'
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });

      // Top des produits vendus
      new Chart(document.getElementById("topProduitsChart"), {
        type: "bar",
        data: {
          labels: this.topProduits.map(produit => produit.label),
          datasets: [
            {
              label: "Quantité vendue",
              data: this.topProduits.map(produit => produit.value),
              backgroundColor: "#FFA500",
              borderColor: "#FF8C00",
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: 'y', // Barres horizontales pour meilleure lisibilité
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: 'white'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              ticks: {
                color: 'white'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            }
          }
        }
      });
    },
    
    formatDate(timestamp) {
      if (!timestamp) return "-";
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString("fr-FR");
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount || 0);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 150px;
  color: white;
  background-color: #121212;
  font-family: 'Inter', 'Roboto', sans-serif;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
}

h1 {
  text-align: center;
  color: #B1FF36;
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #B1FF36;
}

h2 {
  color: #B1FF36;
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 600;
}

/* Section InfoGeneral */
.infoGeneral {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.card {
  background-color: rgba(30, 30, 30, 0.9);
  border: 2px solid #B1FF36;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(177, 255, 54, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(177, 255, 54, 0.3);
}

.card p {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 15px;
  color: white;
}

.card.total-vente p {
  color: #B1FF36;
  font-size: 2.2rem;
}

/* Section catégorie */
.categorie {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.categories-list {
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(177, 255, 54, 0.3);
}

.categories-list ul {
  list-style: none;
  padding: 0;
}

.categories-list li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.categories-list li:last-child {
  border-bottom: none;
}

/* Charts */
.chart-container {
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(177, 255, 54, 0.3);
}

canvas {
  max-height: 350px;
  margin: 0 auto;
}

/* Tables */
.table-container {
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 40px;
  overflow-x: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(177, 255, 54, 0.3);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: white;
}

th, td {
  border: none;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: rgba(177, 255, 54, 0.15);
  color: #B1FF36;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.05);
}

tr:hover {
  background-color: rgba(177, 255, 54, 0.1);
  transition: background-color 0.2s;
}

td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive design */
@media (max-width: 992px) {
  .categorie {
    grid-template-columns: 1fr;
  }
  
  .infoGeneral {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .card p {
    font-size: 1.8rem;
  }
}

/* Animation pour les chargements */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-container, .table-container, .card {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Ajustements pour les graphiques */
#venteCategorieChart, #statusCommandeChart {
  margin: 0 auto;
  max-width: 400px;
}
</style>