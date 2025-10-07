#!/usr/bin/node

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function fibonacci(first = 0, second = 1, iterations, arr) {
    arr.push(first);  
    tmp = second;
    second = first + second;
    first = tmp;
    if (iterations > 0) {
        fibonacci(first, second, iterations - 1, arr);
    }
}

function merge(a, b) {
  const out = [];
  let i = 0, j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);

  return out;
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice(); 
  const mid = Math.floor(arr.length / 2);   
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function runFib(){
    let arr = [];
    fibonacci(undefined, undefined, 10, arr);
    shuffle(arr);
    arr = mergeSort(arr);
    console.log(arr);
}

runFib();