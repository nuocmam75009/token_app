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
                    :class="{
                    'selected': answerIndex === selectedAnswer,
                    'disabled': timer === 0
                    }"
                    >
                        {{ option }}
                    </button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading questions...</p>
        </div>

        <div v-if="isFinished">
    <h3>Quiz Finished!</h3>
    <p>Your Results:</p>
    <ul>
        <li v-for="(result, index) in results" :key="index">
            {{ result.question }} - Your Answer: {{ result.selectedAnswer }} - {{ result.isCorrect ? 'Correct' : 'Incorrect' }}
        </li>
    </ul>
    <router-link :to="{ name: 'UserDashboard', params: { results: results } }">Check your progress!</router-link>
</div>

    </div>
</template>


<script>

import { ref, onMounted, computed } from 'vue';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';


export default {
    name: 'GamePage',
    props: ['mode'],
    setup(props) {
        const questions = ref([]);
        const timer = ref(15);
        let intervalId = null;
        const currentQuestionIndex = ref(0);
        const isFinished = ref(false);
        const results = ref([]);
        const answerSelected = ref(false); //track if answer is selected
        const selectedAnswer = ref(null); //track selected answer's idx

        const fetchQuestions = async () => {
            // Fetch questions from Firestore
            try {
                const collectionName = `${props.mode}_questions`;
                console.log("Fetching questions from collection:", collectionName); // Debugging

                const questionsSnapshot = await getDocs(collection(db, collectionName));
                questions.value = questionsSnapshot.docs.map(doc =>
                doc.data());
                correctAnswer: doc.data().correctAnswer; /* eslint-disable-line */

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const selectAnswer = (optionIndex) => {
            console.log(`Selected answer: ${optionIndex}`);

            const correctIndex = currentQuestion.value.correctAnswer;

            const isCorrect = optionIndex === correctIndex; // cmp selected option with correct option
            console.log(`Selected answer's index: ${optionIndex}, Correct answer: ${correctIndex}, Is Correct: ${isCorrect}`); //debug

            // store results in array
            results.value.push({
/*                 question: currentQuestion.value.question,
                selectedAnswer: currentQuestion.value.options[optionIndex], */
                isCorrect: isCorrect,
            });

            answerSelected.value = true;
            selectedAnswer.value = optionIndex;

            moveToNextQuestion();
        };

        const resetTimer = () => {
            timer.value = 15;
            answerSelected.value = false;
            selectedAnswer.value = null;
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
            results,
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