<!-- This file is not used. It's a test file for the GamePage.vue file. -->
/* eslint-disable */
<template>
    <div class="game">
        <h2>You are now playing in {{ mode }} mode</h2>
      <div v-if="timer > 0">Time left: {{ timer }} seconds</div>
      <div v-else>Time's up!</div>

      <div v-if="questions.length > 0 ">
        <div v-for="(question, index) in questions" :key="index" class="question">
            <p>{{ question.question }}</p>
            <div class="options">
                <button v-for="(option, idx) in question.options" :key="idx">
                    {{ option }}
                </button>
            </div>
        </div>
      </div>
      <div v-else>
        <p>Loading questions...</p>
      </div>
    </div>
</template>


<script>

import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
    name: 'GamePage',
    props: ['mode'],
    setup(props) {
        // Data object
        const questions = ref([]);
        const db = getFirestore();

        const fetchQuestions = async () => {
            // Fetch questions from Firestore
            const questionsSnapshot = await getDocs(collection(db, props.mode));
            questions.value = questionsSnapshot.docs.map(doc => doc.data());
        };

        onMounted(() => {
            // Fetch questions when the component is mounted
            fetchQuestions();
        });

        return {
            questions,
            timer: 10,
        };
    }
};

</script>

<style>

button {
    width: 100%;
    height: 50px;
    background-color: lightblue;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin: 10px 0;
    transition: background-color 0.3s;
}

</style>