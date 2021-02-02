function all(iterable) {
    return new Promise((resolve, reject) => {
        let index = 0;
        for (const promise of iterable) {
            // Capture the current value of `index`
            const currentIndex = index;
            promise.then(
                (value) => {
                    if (anErrorOccurred) return;
                    result[currentIndex] = value;
                    elementCount++;
                    if (elementCount === result.length) {
                        resolve(result);
                    }
                },
                (err) => {
                    if (anErrorOccurred) return;
                    anErrorOccurred = true;
                    reject(err);
                });
            index++;
        }
        if (index === 0) {
            resolve([]);
            return;
        }
        let elementCount = 0;
        let anErrorOccurred = false;
        const result = new Array(index);
    });
}