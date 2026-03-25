export const formatCurrency = (value, options = {}) => {
    const { currency = 'INR', decimalPlaces = 2, compact = false, showSign = false } = options;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
        notation: compact ? 'compact' : 'standard',
        signDisplay: showSign ? 'always' : 'auto',
    }).format(value);
};
