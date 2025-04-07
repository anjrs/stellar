<script>
import { ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import Header from '../components/Header.vue';

Chart.register(...registerables);

export default {
  name: 'Dashboard',
  components: {
    Header
  },
  setup() {
    // Données simulées pour les ventes
    const ventes = ref([
      { id: 1, client: 'Alice', date: '2025-04-01', total: 5000 },
      { id: 2, client: 'Bob', date: '2025-04-02', total: 3000 },
      { id: 3, client: 'Charlie', date: '2025-04-03', total: 7000 },
      { id: 4, client: 'Alice', date: '2025-04-04', total: 2000 }
    ]);

    // Fonction pour trier les ventes par date
    const trierParDate = () => {
      ventes.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    // Fonction pour trier les ventes par client
    const trierParClient = () => {
      ventes.value.sort((a, b) => a.client.localeCompare(b.client));
    };

    return {
      ventes,
      trierParDate,
      trierParClient
    };
  },
  mounted() {
    // Initialisation du graphique
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
        datasets: [
          {
            label: 'Ventes (en Ar)',
            data: [12000, 15000, 8000, 20000, 10000],
            backgroundColor: '#B1FF36',
            borderColor: '#B1FF36',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white'
            }
          },
          y: {
            ticks: {
              color: 'white'
            }
          }
        }
      }
    });
  }
};
</script>

<template>
  <div class="container">
    <Header />

    <div class="dashboard">
      <!-- Liste des ventes -->
      <div class="ventes">
        <h2>Liste des ventes</h2>
        <div class="actions">
          <button @click="trierParDate">Trier par date</button>
          <button @click="trierParClient">Trier par client</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total (Ar)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vente in ventes" :key="vente.id">
              <td>{{ vente.id }}</td>
              <td>{{ vente.client }}</td>
              <td>{{ vente.date }}</td>
              <td>{{ vente.total.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Graphiques -->
      <div class="graphes">
        <h2>Statistiques des ventes</h2>
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

.dashboard {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.ventes {
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 20px;
  padding: 20px;
  color: white;
}

.ventes h2 {
  font-size: 24px;
  color: #B1FF36;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.actions button {
  background-color: #B1FF36;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.actions button:hover {
  background-color: white;
  color: black;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #B1FF36;
  color: black;
}

td {
  color: white;
}

.graphes {
  background-color: transparent;
  border: 3px solid #B1FF36;
  border-radius: 20px;
  padding: 20px;
  color: white;
}

.graphes h2 {
  font-size: 24px;
  color: #B1FF36;
  margin-bottom: 20px;
}

canvas {
  max-width: 100%;
  height: 400px;
}
</style>