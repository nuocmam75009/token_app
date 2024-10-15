<template>
    <h1>Track your progress here.</h1>

    <div class="user-dashboard">
    <!-- <p>Here are your results:</p> -->

    <div v-if="results.length > 0">
        <ul>
            <li v-for="(result, index) in results" :key="index">
                <strong>Question:</strong> {{ result.question }} <br>
                <strong>Your Answer:</strong> {{ result.selectedAnswer }} <br>
                <strong>Result:</strong> <span :class="{'correct': result.isCorrect, 'incorrect': !result.isCorrect}">
                    {{ result.isCorrect ? 'Correct' : 'Incorrect' }}
                </span>
            </li>
        </ul>

    </div>
    <div v-else>
        <p>Nothing to display here!</p>
    </div>

</div>

</template>

<script>

import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export default {
    name: 'UserDashboard',
    props: {
        results: {
            type: Array,
            required: true,
            default: () => [], // empty array if undefined
        }
    },
};


</script>

<style>

</style>