<template>
<div class="home-container">
    <h1>Choose your difficulty level</h1>

    <div class="button-container">
      <router-link :to="{ name : 'Easymode', params: { mode: 'easy' } }">
        <button>Easy</button>
      </router-link>
      <router-link :to="{ name : 'IntermediateMode', params: { mode: 'intermediate' } }">
        <button>Intermediate</button>
      </router-link>
      <router-link :to="{ name : 'HardMode', params: { mode: 'hard' } }">
        <button>Hard</button>
      </router-link>
  </div>
</div>

</template>

<script>
export default {
    methods:{
        startGame(difficulty) {
            this.$router.push({ name: 'game', params: { difficulty } });
        },
    },
    name: 'HomePage',
};

</script>

<style>

.home-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
}

.button-container {
    display: flex;
    justify-content: space-around;
    width: 300px;
    margin-top: 20px;
}

button {
  width: 140px;
  height: 60px;
  background-color: lightblue;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}


button:hover {
  background-color: darkblue;
  color: white;
}

</style>