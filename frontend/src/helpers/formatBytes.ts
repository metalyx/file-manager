export const formatBytes = (bytes: number) => {
    const MB = Number((bytes / 1048576).toFixed(2));

    if (MB >= 0.5) {
        return `${MB} MB`;
    }

    const KB = Number((bytes / 1000).toFixed(2));

    if (KB >= 1) {
        return `${KB} kb`;
    }

    return `${bytes} bytes`;
};
