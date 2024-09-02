/**
 * @param {string[]} words
 * @param {number} k
 * @return {string[]}
 */
var topKFrequent = function(words, k) {
    // Step 1: create a frequency dictionary to count each word
    const freqDict = {};
    words.forEach(word => {
        freqDict[word] = (freqDict[word] || 0) + 1;
    });

    // custom comparator for the min-heap
    const comparator = (a, b) => {
        if (a[1] === b[1]) {
            return b[0].localeCompare(a[0]);
        }
        return a[1] - b[1];
    };

    const minHeap = [];

    // function to move the new element up to its correct position in the heap
    function heapifyUp(index) {
        let parentIndex;
        while (index > 0) {
            parentIndex = Math.floor((index - 1) / 2);
            if (comparator(minHeap[parentIndex], minHeap[index]) <= 0) break;
            [minHeap[parentIndex], minHeap[index]] = [minHeap[index], minHeap[parentIndex]];
            index = parentIndex;
        }
    }

    // function to adjust the heap if the root element is not the smallest
    function heapifyDown(index) {
        let smallest = index;
        const leftIndex = 2 * index + 1;
        const rightIndex = 2 * index + 2;

        if (leftIndex < minHeap.length && comparator(minHeap[leftIndex], minHeap[smallest]) < 0) {
            smallest = leftIndex;
        }
        if (rightIndex < minHeap.length && comparator(minHeap[rightIndex], minHeap[smallest]) < 0) {
            smallest = rightIndex;
        }
        if (smallest !== index) {
            [minHeap[index], minHeap[smallest]] = [minHeap[smallest], minHeap[index]];
            heapifyDown(smallest);
        }
    }

    // Step 3: fill the heap with the top k elements using the frequency dictionary
    Object.keys(freqDict).forEach(word => {
        minHeap.push([word, freqDict[word]]);
        heapifyUp(minHeap.length - 1);
        if (minHeap.length > k) {
            minHeap[0] = minHeap.pop();
            heapifyDown(0);
        }
    });

    // Step 4: sort the heap for the final output
    minHeap.sort((a, b) => {
        if (b[1] === a[1]) {
            return a[0].localeCompare(b[0]);
        }
        return b[1] - a[1];
    });

    // Step 5: extract the words from the sorted minHeap
    return minHeap.map(item => item[0]);
}
