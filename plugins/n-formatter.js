export default ({ app }, inject) => {
    inject('nFormatter', num => {
        if (num >= 1000000000) {
            if (num > (num / 1000000000).toFixed(1) * 1000000000) {
                return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G+';
            }
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            if (num > (num / 1000000).toFixed(1) * 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
            }
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            if (num > (num / 1000).toFixed(1) * 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
            }
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num || 0;
    });
}