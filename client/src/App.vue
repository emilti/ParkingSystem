<template>
  <div id="app"> 
    <Header/>
    <b-container>
        <b-row>
          <b-col sm="4">
            <b-form-input v-model="searchTerm" type="text" placeholder="Enter registration number"></b-form-input>
          </b-col>
        </b-row>
    </b-container>
    <b-container fluid="md" class="mt-1 text-white text-left">
      <b-row  v-for="vehicle in filterByTerm" v-bind:key="vehicle" :style="{'background-color': 'grey'}" class="border-bottom">
        <b-col class="border-right">{{vehicle.registrationNumber}}</b-col>
        <b-col class="border-right">{{vehicle.enterDate | formatDate}}</b-col>
        <b-col>{{vehicle.dueAmount}} лв.</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header   
  },
  data() {
    return {
      vehicles: [],
      searchTerm: ""
    }
  },
  mounted: function(){
  
    fetch('http://localhost:57740/Parking/getvehicles', {
      method: 'get'
    })
    .then((response) => {
      console.log(response)
      return response.json();
    }).then((jsonData) => {
      console.log(jsonData)
      this.vehicles = jsonData;
    })
  },
  computed: {
    filterByTerm() {
      return this.vehicles.filter(v => {
        return v.registrationNumber.toLowerCase().includes(this.searchTerm);
      });
    }
  }
}




</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px
}
</style>
