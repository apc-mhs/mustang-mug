<script>
	export let disabled; 
</script>

<button on:click disabled={disabled}>
    <slot></slot>
</button>

<style>
button {
    margin-top: 0.5em;
	background-color: rgb(206, 44, 44);
	border-radius:3px;
	border:1px solid #0b0e07;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-size:15px;
	padding:9px 23px;
	text-decoration:none;
	text-shadow:0px 1px 0px black;
}
button:hover {
	background-color:rgb(126, 33, 33);
}
button:active {
	position:relative;
	top:1px;
}
</style>
