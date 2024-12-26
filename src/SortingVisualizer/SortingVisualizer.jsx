import React from 'react';
import { getMergeSortAnimations } from './sortingAlgorithms';
import './SortingVisualizer.css';

// Change this value for the speed of the animations.
const ANIMATION_SPEED_MS = 50;

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 150;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'turquoise';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 730));
    }
    this.setState({ array });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    this.animateSorting(animations);
  }

  quickSort() {
    const animations = [];
    const array = this.state.array.slice();
    quickSortHelper(array, 0, array.length - 1, animations);
    this.animateSorting(animations);
  }

  heapSort() {
    const animations = [];
    const array = this.state.array.slice();
    heapSortHelper(array, animations);
    this.animateSorting(animations);
  }

  bubbleSort() {
    const animations = [];
    const array = this.state.array.slice();
    bubbleSortHelper(array, animations);
    this.animateSorting(animations);
  }

  animateSorting(animations) {
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = animations[i][0] === 'compare';

      if (isColorChange) {
        const [_, barOneIdx, barTwoIdx] = animations[i];
        const color = animations[i][3] ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          arrayBars[barOneIdx].style.backgroundColor = color;
          arrayBars[barTwoIdx].style.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        const [_, barIdx, newHeight] = animations[i];
        setTimeout(() => {
          arrayBars[barIdx].style.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  render() {
    const { array } = this.state;

    return (
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}
        <div className="button-container">
          <button onClick={() => this.resetArray()}>Generate New Array</button>
          <button onClick={() => this.mergeSort()}>Merge Sort</button>
          <button onClick={() => this.quickSort()}>Quick Sort</button>
          <button onClick={() => this.heapSort()}>Heap Sort</button>
          <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function quickSortHelper(array, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) return;
  const pivotIdx = partition(array, startIdx, endIdx, animations);
  quickSortHelper(array, startIdx, pivotIdx - 1, animations);
  quickSortHelper(array, pivotIdx + 1, endIdx, animations);
}

function partition(array, startIdx, endIdx, animations) {
  const pivot = array[endIdx];
  let i = startIdx;
  for (let j = startIdx; j < endIdx; j++) {
    animations.push(['compare', i, j, true]);
    animations.push(['compare', i, j, false]);
    if (array[j] < pivot) {
      animations.push(['swap', i, array[j]]);
      animations.push(['swap', j, array[i]]);
      [array[i], array[j]] = [array[j], array[i]];
      i++;
    }
  }
  animations.push(['swap', i, array[endIdx]]);
  animations.push(['swap', endIdx, array[i]]);
  [array[i], array[endIdx]] = [array[endIdx], array[i]];
  return i;
}

function heapSortHelper(array, animations) {
  const n = array.length;
  for (let i = Math.floor(n / 2 - 1); i >= 0; i--) heapify(array, n, i, animations);
  for (let i = n - 1; i > 0; i--) {
    animations.push(['swap', 0, array[i]]);
    animations.push(['swap', i, array[0]]);
    [array[0], array[i]] = [array[i], array[0]];
    heapify(array, i, 0, animations);
  }
}

function heapify(array, n, i, animations) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;
  if (largest !== i) {
    animations.push(['swap', i, array[largest]]);
    animations.push(['swap', largest, array[i]]);
    [array[i], array[largest]] = [array[largest], array[i]];
    heapify(array, n, largest, animations);
  }
}

function bubbleSortHelper(array, animations) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push(['compare', j, j + 1, true]);
      animations.push(['compare', j, j + 1, false]);
      if (array[j] > array[j + 1]) {
        animations.push(['swap', j, array[j + 1]]);
        animations.push(['swap', j + 1, array[j]]);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
}
