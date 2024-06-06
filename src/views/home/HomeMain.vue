<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <h3>Usuarios</h3>
          <p>{{ statistics.userCount }}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <h3>Productos</h3>
          <p>{{ statistics.productCount }}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <h3>Pedidos</h3>
          <p>{{ statistics.orderCount }}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <h3>Ganancias Totales</h3>
          <p>{{ statistics.totalRevenue | currency }}</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <h3>Ganancias de los últimos 12 meses</h3>
          <el-table :data="monthlyRevenueData">
            <el-table-column prop="month" label="Mes" />
            <el-table-column prop="revenue" label="Ganancia" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { statisticsListService } from '@/api/statistics.js';

export default {
  data() {
    return {
      statistics: {
        userCount: 0,
        productCount: 0,
        orderCount: 0,
        totalRevenue: 0,
        monthlyRevenue: []
      }
    };
  },
  computed: {
    monthlyRevenueData() {
      return this.statistics.monthlyRevenue.map((revenue, index) => {
        return {
          month: `${index + 1}`,
          revenue: revenue
        };
      });
    }
  },
  filters: {
    currency(value) {
      return `$${value.toFixed(2)}`;
    }
  },
  mounted() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await statisticsListService();
        this.statistics = response.data;
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    }
  }
};
</script>

<style scoped>
h3 {
  margin: 0;
}
</style>
