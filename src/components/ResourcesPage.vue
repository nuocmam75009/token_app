<template>

<h1>Resources</h1>

<h3>Basic Commands</h3>
<div class="commands">

    <div class="container">
        <v-tooltip location="top" activator="parent">
        <template #VTooltip>
            <v-btn v-bind="props"></v-btn>
        </template>
        <span>Git is a distributed version control system widely used in software development. <br>
            It allows multiple people to work on a project simultaneously, <br>
            tracking changes and managing different versions of code.</span>
    </v-tooltip>
      <p>Git</p>
    </div>
    
    <div class="container">
        <p>Bash</p>
    </div>
    <div class="container">
        <p>Shell</p>
    </div>
</div>

<h3>Basic Computer Science</h3>
<div class="basic-cs">
    <div class="container">
        <p>Operating System</p>
    </div>
    <div class="container">
        <p>Cloud Computing</p>
    </div>
    <div class="container">
        <p>Data</p>
    </div>
    <div class="container">
        <p>IDE</p>
    </div>
    <div class="container">
        <p>Terminal</p>
    </div>
    <div class="container">
        <p>Networking</p>
    </div>

</div>


<h3>Programming Languages</h3>
<div class="languages">
    <div class="container">
        <p>C</p>
    </div>
    <div class="container">
        <p>Python</p>
    </div>
    <div class="container">
        <p>JavaScript</p>
    </div>
    <div class="container">
        <p>SQL</p>
    </div>
    <div class="container">
        <p>Golang</p>
    </div>
    <div class="container">
        <p>HTML</p>
    </div>
    <div class="container">
        <p>CSS</p>
    </div>

</div>


<h3>Advanced Computer Science</h3>
<div class="advanced-cs">
    <div class="container">
        <p>Binary, Decimal & Hexadecimal</p>
    </div>
    <div class="container">
        <p>Object-Oriented Programming</p>
    </div>
    <div class="container">
        <p>Data Structure</p>
    </div>
    <div class="container">
        <p>Algorithms</p>
    </div>

</div>

</template>

<script>

import { VTooltip } from 'vuetify/components'

export default {
    components: {
        VTooltip
    },
};

</script>

<style>

.container {
    width: 100px;
    height: auto;
    background-color: lightgray;
    padding: 3px;
    margin: 3px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

}

.commands, .languages, .basic-cs, .advanced-cs, .data-structures {
    display: flex;
    justify-content: space-around; /* Distribute containers evenly */
    flex-wrap: wrap; /* Allow wrapping to a new row if containers overflow */

}

.v-tooltip {
    display: inline-block;
    margin: 0 10px;
}


</style>