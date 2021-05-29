<script>
export let name;
export let height = 24;
export let width = 24;
export let dp = 24;
</script>

<svg height="{height}px" width="{width}px">
    <use xlink:href="/icons-{dp}dp.svg#{name}" height="{height}px" width="{width}px"></use>
</svg>
