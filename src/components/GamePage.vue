<!--
THIS IS THE PAGE WHERE THE GAME WILL BE PLAYED
-->
<template>
    <div class="game">
        <h2>You are now playing in {{ mode }} mode</h2>

        <div v-if="timer > 0">Time left: {{ timer }} seconds</div>
        <div v-else>Time's up!</div>

        <div v-if="questions.length > 0">
            <div class="question">
                <p>{{ currentQuestion.question }}</p>
                <div class="options">
                    <button v-for="(option, answerIndex) in currentQuestion.options"
                    :key="answerIndex"
                    @click="selectAnswer(answerIndex)"
                    :disabled="timer === 0 || answerSelected"
                    :class="{'selected': answerIndex === selectedAnswer, 'disabled': timer === 0}"
                    >
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

import { ref, onMounted, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';


export default {
    name: 'GamePage',
    props: ['mode'],
    setup(props) {
        const questions = ref([]);
        const timer = ref(10);
        let intervalId = null;
        const currentQuestionIndex = ref(0);
        const isFinished = ref(false);

        const fetchQuestions = async () => {
            // Fetch questions from Firestore
            try {
                const collectionName = `${props.mode}_questions`;
                console.log("Fetching questions from collection:", collectionName); // Debugging

                const questionsSnapshot = await getDocs(collection(db, collectionName));

                questions.value = questionsSnapshot.docs.map(doc => doc.data());
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const selectAnswer = (option) => {
            console.log(`Selected answer: ${option}`);
            moveToNextQuestion();
        };

        const resetTimer = () => {
            timer.value = 10;
            // clear interval to avoid multiple timers running
            if (intervalId) clearInterval(intervalId);

            // countdown for next question
            intervalId = setInterval(() => {
                if (timer.value > 0) {
                    timer.value--;
                } else {
                    moveToNextQuestion(); // add this line so it keeps moving forward as long as time's up 
                    clearInterval(intervalId);
                }
            }, 1000);
        };

        const moveToNextQuestion = () => {
            // Move to the next question if there are more questions
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                resetTimer();
            }
            else {
                isFinished.value = true;
                clearInterval(intervalId);
            }
        };

        onMounted(() => {
            fetchQuestions();
            console.log('Selected mode:', props.mode); // Debugging
            intervalId = setInterval(() => {
                // Decrement timer every second
                if (timer.value > 0) {
                    timer.value--;
                } else {
                    clearInterval(intervalId);
                    moveToNextQuestion();
                }
            }, 1000);
        });

        const currentQuestion = computed(() =>
            // Return the current question based on the current index
            questions.value[currentQuestionIndex.value]
        );

        return {
            questions,
            currentQuestion,
            timer,
            selectAnswer,
            currentQuestionIndex,
            isFinished,
        };
    }
};

</script>


<style>

button {
    width: 100%;
    height: 50px;
    background-color: rgb(64, 121, 139);
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin: 10px 0;
    transition: background-color 0.3s;
}

</style>