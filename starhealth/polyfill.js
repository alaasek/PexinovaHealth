if (!Array.prototype.toReversed) {
    Array.prototype.toReversed = function () {
        return Array.from(this).reverse();
    };
}
