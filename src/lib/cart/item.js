import { getOptionIdsFromProperties } from "$lib/msb/cart";

function isOutOfStock(item, outOfStockItemIds, outOfStockOptionIds) {
    return (
        outOfStockItemIds.includes(item.itemId) ||
        getOptionIdsFromProperties(item.properties).some((optionId) =>
            outOfStockOptionIds.includes(optionId)
        )
    );
}

export {
    isOutOfStock,
};
