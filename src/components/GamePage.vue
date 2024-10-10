<!-- PAGE FOR THE GAME -->
<template>
    <div class="game">
        <h2>You are now playing in {{ mode }} mode</h2>

        <div v-if="timer > 0">Time left: {{ timer }} seconds</div>
        <div v-else>Time's up!</div>

        <div v-if="questions.length > 0">
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';


export default {
    name: 'GamePage',
    props: ['mode'],
    setup(props) {
        const questions = ref([]);
        const timer = ref(10);
        let intervalId;

        const fetchQuestions = async () => {
            // Fetch questions from Firestore
            try {
                const collectionName = `${props.mode}_questions`;
                const questionsSnapshot = await getDocs(collection(db, collectionName));
                questions.value = questionsSnapshot.docs.map(doc => doc.data());
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        onMounted(() => {
            // Fetch questions when the component is mounted
            fetchQuestions();
            console.log('Selected mode:', props.mode); // Debugging
            intervalId = setInterval(() => {
                // Decrement timer every second
                if (timer.value > 0) {
                    timer.value--;
                } else {
                    clearInterval(intervalId);
                }
            }, 1000);
        });

        return {
            questions,
            timer,
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