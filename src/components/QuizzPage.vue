<template>
    <div>
      <h1>{{ question }}</h1>
      <div v-if="timer > 0">Time left: {{ timer }} seconds</div>
      <div v-else>Time's up!</div>

      <button v-for="option in options" :key="option" @click="checkAnswer(option)">
        {{ option }}
      </button>
    </div>
  </template>


<script>

export default {
    data() {
        return {
            timer: 10,
            question: "What is a database?",
            options: ["A collection of data", "A collection of tables", "A collection of rows", "A collection of columns"],
            correctAnswer: "A collection of data",
            intervalId: null,
        };
    },
    created() {
        this.startTimer();
    },
    methods: {
        startTimer() {
            this.intervalId = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--;
                } else {
                    clearInterval(this.intervalId);
                    this.goToResults(false); // no answer
                }
            }, 1000);
        },
        checkAnswer(answer) {
            clearInterval(this.intervalId); // stop the timer on click
            if (answer === this.correctAnswer) {
                this.goToResults(true); // correct
            } else {
                this.goToResults(false); // wrong answer
            }
        },
        goToResults(isCorrect) {
            this.$router.push({ name: "results", params: { isCorrect } });
        },
    }
}

</script>

<style>

</style>