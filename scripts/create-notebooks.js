import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notebooks = {
  'getting-started-python': {
    cells: [
      {cell_type: 'markdown', metadata: {}, source: ['# Getting Started with Python\n', '\n', 'Learn Python basics - variables, loops, functions, and more!']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['# Variables\n', 'name = "Alice"\n', 'age = 25\n', 'print(f"Hello {name}, you are {age}")']},
      {cell_type: 'markdown', metadata: {}, source: ['## Math Operations']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['a, b = 10, 3\n', 'print(f"Add: {a+b}")\n', 'print(f"Multiply: {a*b}")\n', 'print(f"Power: {a**b}")']},
      {cell_type: 'markdown', metadata: {}, source: ['## Loops and Conditions']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['for i in range(5):\n', '    if i % 2 == 0:\n', '        print(f"{i} is even")\n', '    else:\n', '        print(f"{i} is odd")']},
      {cell_type: 'markdown', metadata: {}, source: ['## Functions']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['def greet(name):\n', '    return f"Hello, {name}!"\n', '\n', 'print(greet("World"))']},
      {cell_type: 'markdown', metadata: {}, source: ['## Lists and Dictionaries']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['fruits = ["apple", "banana", "cherry"]\n', 'for fruit in fruits:\n', '    print(fruit)']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['person = {"name": "Alice", "age": 30}\n', 'for k, v in person.items():\n', '    print(f"{k}: {v}")']},
    ],
    metadata: {kernelspec: {display_name: 'Python 3', language: 'python', name: 'python3'}},
    nbformat: 4, nbformat_minor: 4
  },
  'data-visualization-intro': {
    cells: [
      {cell_type: 'markdown', metadata: {}, source: ['# Data Visualization\n', '\n', 'Create charts with matplotlib!']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['import matplotlib.pyplot as plt\n', 'import numpy as np\n', '%matplotlib inline']},
      {cell_type: 'markdown', metadata: {}, source: ['## Line Plot']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['x = np.linspace(0, 10, 100)\n', 'plt.figure(figsize=(8,5))\n', 'plt.plot(x, np.sin(x), label="sin")\n', 'plt.plot(x, np.cos(x), label="cos")\n', 'plt.legend()\n', 'plt.title("Trig Functions")\n', 'plt.show()']},
      {cell_type: 'markdown', metadata: {}, source: ['## Bar Chart']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['langs = ["Python", "JS", "Java"]\n', 'scores = [85, 78, 65]\n', 'plt.bar(langs, scores, color=["blue","yellow","orange"])\n', 'plt.title("Language Popularity")\n', 'plt.show()']},
      {cell_type: 'markdown', metadata: {}, source: ['## Scatter Plot']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['np.random.seed(42)\n', 'x = np.random.randn(50)\n', 'y = 2*x + np.random.randn(50)*0.5\n', 'plt.scatter(x, y, alpha=0.7)\n', 'plt.title("Scatter Plot")\n', 'plt.show()']},
    ],
    metadata: {kernelspec: {display_name: 'Python 3', language: 'python', name: 'python3'}},
    nbformat: 4, nbformat_minor: 4
  },
  'numpy-fundamentals': {
    cells: [
      {cell_type: 'markdown', metadata: {}, source: ['# NumPy Fundamentals\n', '\n', 'Essential array operations for data science!']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['import numpy as np\n', 'print(f"NumPy {np.__version__}")']},
      {cell_type: 'markdown', metadata: {}, source: ['## Creating Arrays']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['arr = np.array([1, 2, 3, 4, 5])\n', 'print(f"Array: {arr}")\n', 'print(f"Shape: {arr.shape}")']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['print("Zeros:", np.zeros(5))\n', 'print("Ones:", np.ones(5))\n', 'print("Range:", np.arange(0, 10, 2))']},
      {cell_type: 'markdown', metadata: {}, source: ['## Operations']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['a = np.array([1, 2, 3])\n', 'b = np.array([4, 5, 6])\n', 'print(f"a + b = {a + b}")\n', 'print(f"a * b = {a * b}")\n', 'print(f"a ** 2 = {a ** 2}")']},
      {cell_type: 'markdown', metadata: {}, source: ['## Statistics']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['data = np.array([23, 45, 12, 67, 34])\n', 'print(f"Mean: {np.mean(data):.2f}")\n', 'print(f"Std: {np.std(data):.2f}")\n', 'print(f"Min: {np.min(data)}, Max: {np.max(data)}")']},
    ],
    metadata: {kernelspec: {display_name: 'Python 3', language: 'python', name: 'python3'}},
    nbformat: 4, nbformat_minor: 4
  },
  'javascript-algorithms': {
    cells: [
      {cell_type: 'markdown', metadata: {}, source: ['# JavaScript Algorithms\n', '\n', 'Practice sorting, searching, and more!']},
      {cell_type: 'markdown', metadata: {}, source: ['## Binary Search']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['function binarySearch(arr, target) {\n', '  let left = 0, right = arr.length - 1;\n', '  while (left <= right) {\n', '    const mid = Math.floor((left + right) / 2);\n', '    if (arr[mid] === target) return mid;\n', '    if (arr[mid] < target) left = mid + 1;\n', '    else right = mid - 1;\n', '  }\n', '  return -1;\n', '}\n', 'console.log(binarySearch([1,3,5,7,9], 5));']},
      {cell_type: 'markdown', metadata: {}, source: ['## Quick Sort']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['function quickSort(arr) {\n', '  if (arr.length <= 1) return arr;\n', '  const pivot = arr[0];\n', '  const left = arr.slice(1).filter(x => x < pivot);\n', '  const right = arr.slice(1).filter(x => x >= pivot);\n', '  return [...quickSort(left), pivot, ...quickSort(right)];\n', '}\n', 'console.log(quickSort([3,1,4,1,5,9,2,6]));']},
      {cell_type: 'markdown', metadata: {}, source: ['## Fibonacci']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['function fib(n, memo = {}) {\n', '  if (n in memo) return memo[n];\n', '  if (n <= 1) return n;\n', '  memo[n] = fib(n-1, memo) + fib(n-2, memo);\n', '  return memo[n];\n', '}\n', 'console.log([...Array(10)].map((_, i) => fib(i)));']},
      {cell_type: 'markdown', metadata: {}, source: ['## Two Sum']},
      {cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: ['function twoSum(nums, target) {\n', '  const map = new Map();\n', '  for (let i = 0; i < nums.length; i++) {\n', '    const complement = target - nums[i];\n', '    if (map.has(complement)) return [map.get(complement), i];\n', '    map.set(nums[i], i);\n', '  }\n', '  return [];\n', '}\n', 'console.log(twoSum([2,7,11,15], 9));']},
    ],
    metadata: {kernelspec: {display_name: 'JavaScript', language: 'javascript', name: 'javascript'}},
    nbformat: 4, nbformat_minor: 4
  }
};

const dir = './public/notebooks';
for (const [name, content] of Object.entries(notebooks)) {
  fs.writeFileSync(path.join(dir, name + '.ipynb'), JSON.stringify(content, null, 1));
  console.log('Created:', name + '.ipynb');
}

console.log('\nDone! Notebooks created in', dir);
