<template>

<h1>Resources here. Start learning!</h1>

<h3>Basic Commands</h3>
<div class="commands">
    <div class="container">
        <p>Git</p>
    </div>
    <div class="container">
        <p>Bash</p>
    </div>
    <div class="container">
        <p>Shell</p>
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
</div>

<h3>Basic Computer Science Notions</h3>
<div class="basic-cs">
    <div class="container">
        <p>Linux</p>
    </div>
    <div class="container">
        <p>What's an Operating System?</p>
    </div>
</div>

<h3>Advanced Computer Science Notions</h3>
<div class="advanced-cs">
    <div class="container">
        <p>Binary, Decimal & Hexadecimal</p>
    </div>
</div>

<h3>Data Structures & Algorithms</h3>
<div class="data-structures">
    <div class="container">
        <p>Binary Search Tree</p>
    </div>
    <div class="container">
        <p>Traverse a Node</p>
    </div>
</div>

</template>

<script>


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
</style>