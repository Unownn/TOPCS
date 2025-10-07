#!/usr/bin/node

class Node {
    constructor(value){
        this.value = value;
        this.nextNode = null;
    }
}

class LinkedList {
    constructor(){
        this.head = null;
        this.tail = null;
        this.len = 0;
    }
    
    // Add value in the end of the list
    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
        this.head = this.tail = newNode;
        } else {
        this.tail.nextNode = newNode;
        this.tail = newNode;
        }
        this.len += 1;
    }

    // Add value in front of the list
    prepend(value){
        const newNode = new Node(value);
        if (!this.head) {
        this.head = this.tail = newNode;
        } else {
            newNode.nextNode = this.head;
            this.head = newNode;
        }
        this.len += 1;
    }

    // Return list size
    size(){
        return this.len;
    }

    // Return head
    getHead(){
        return this.head;
    }

    // Return tail
    getTail(){
        return this.tail;
    }

    // Get value at index
    at(index){
        let cur = this.head;
        let indexer = 0;
        while(cur != null){
            if (indexer == index){
                return cur.value;
            }
            cur = cur.nextNode;
            indexer ++;
        }
        return undefined;
    }

    // Remove the last element and return the value
    pop(){
        if (!this.head) return null;

        if (this.head === this.tail) {
            const val = this.head.value;
            this.head = this.tail = null;
            this.len--;
            return val;
        }

        let current = this.head;
        while (current.nextNode !== this.tail) {
            current = current.nextNode;
        }

        const val = this.tail.value;
        this.tail = current;
        this.tail.nextNode = null;
        this.len--;

        return val;
    }

    // Check if value exists in list
    contains(value){
        let cur = this.head;
        while(cur != null){
            if (cur.value == value){
                return cur.value;
            }
            cur = cur.nextNode;
        }
        return undefined;
    }

    // Find the index of value
    find(value){
        let cur = this.head;
        let indexer = 0;
        while(cur != null){
            if (cur.value == value){
                return indexer;
            }
            cur = cur.nextNode;
            indexer ++;
        }
        return undefined;
    }

    // Print the list as a string
    toString() {
        let current = this.head;
        let result = '';

        while (current !== null) {
            result += `( ${current.value} ) -> `;
            current = current.nextNode;
        }

        result += 'null';
        return result;
    }
}

// Assert test cases
const assertEq = (name, got, expected) => {
  const pass = JSON.stringify(got) === JSON.stringify(expected);
  if (pass) console.log(`✅ ${name} passed`);
  else {
    console.error(`❌ ${name} failed`);
    console.log('expected:', expected);
    console.log('got     :', got);
  }
};

// Set linkedlist values to an array
const toArray = (linklist) => {
  const out = [];
  let cur = linklist.head;
  while (cur) { out.push(cur.value); cur = cur.nextNode; }
  return out;
};

// Set array values to linked list
const fromArray = (values, mode = 'append') => {
  const ll = new LinkedList();
  for (const v of values) {
    if (mode === 'append') ll.append(v);
    else ll.prepend(v);
  }
  return ll;
};

// Test array
const lis = ["cat", "dog", "mouse", "house", "poop", "pee", "poopoo"];

// Testing the functionality of the list with multiple values
(() => {
  // Append order
  const llA = fromArray(lis, 'append');
  assertEq('Append order', toArray(llA), lis);

  // Prepend order (reverse)
  const llP = fromArray(lis, 'prepend');
  assertEq('Prepend order', toArray(llP), [...lis].reverse());

  // Size
  const llS = fromArray(lis, 'append');
  assertEq('Size', llS.size(), lis.length);

  // Head
  const llH = fromArray(lis, 'append');
  assertEq('Head', llH.getHead().value, lis[0]);

  // Tail
  const llT = fromArray(lis, 'append');
  assertEq('Tail', llT.getTail().value, lis[lis.length - 1]);

  // At
  const llAt = fromArray(lis, 'append');
  assertEq('At', llAt.at(llAt.size-4), lis[llAt.size-4]);
  assertEq('At (outside listsize)', llAt.at(llAt.size+1), lis[llAt.size+1]);

  // Contains
  const llC = fromArray(lis, 'append');
  assertEq('Contains', llC.contains(lis[llC.size-4]), lis[llC.size-4]);
  assertEq('Contains (value nonexistent)', llC.contains("Random"), undefined);

  // Find
  const llF = fromArray(lis, 'append');
  assertEq('Find', llF.find(lis[llF.size-4]), lis[llF.size-4]);
  assertEq('Find (value nonexistent)', llF.find("Random"), undefined);

  // ToString. No test, just print the list as a whole along with it's input array before popping test
  console.log(`ToString: ${llA.toString()} ${lis}`);

  // Pop (entire list)
  const llPop = fromArray(lis, 'append');
  for (i = llPop.size(); i > 0, i--;){
    assertEq('Pop', llPop.pop(), lis.pop());
    assertEq('Size', llPop.size(), lis.length);
  }
})();

// Could write more testcases for different behaviours -> empty list, one element, duplicates, ..