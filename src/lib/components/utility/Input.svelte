<script>
export let value = '';
export let disabled = false;
export let type = 'text';
export let placeholder = '';

function handleInput(e) {
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
}
</script>

<input {type} {placeholder} {disabled} {value} on:input={handleInput} >

<style>
input {
    font-size: 18px;
    padding: 5px 10px;
    border-radius: 3px;
    border: none;
    outline: none;
    width: 150px;
}

input:focus {
   box-shadow: 0px 0px 0px 1px blue;
}
</style>
