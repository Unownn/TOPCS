import {LinkedList} from "./linkedlist.js";

class HashMap {
    constructor(){
        this.loadFactor = 0.75;
        this.capacity = 16;
        this.buckets = [];
        this.size = 0;
    }

    // helper: iterate a bucket's linked list and return the node for key
    findNodeInBucket(bucket, key) {
        let node = bucket?.head || null;
        while (node) {
            const [k] = node.value;     
            if (k === key) return node; 
            node = node.nextNode;
        }
        return null;
    }

    // Reinsert all values to a bigger hashtable
    rehash(cap){
        const keypairs = this.entries();
        this.clear(cap);
        keypairs.forEach(pairs => {
            this.set(pairs[0], pairs[1]);
        });
    }

    // Hash function. Returns % of capacity
    hash(key) {
        let hashCode = 0;
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode = hashCode % this.capacity;
        }

        return hashCode;
    } 

    // Insert or update a value pair
    set(key, value) {
        // Resize capacity when reaching threshold
        if (this.size >= this.capacity * this.loadFactor) {
            this.capacity *= 2;
            this.rehash(this.capacity); 
        }

        const hash = this.hash(key);
        let bucket = this.buckets[hash];

        // Init bucket if the index is empty
        if (!bucket) {
            bucket = new LinkedList();
            this.buckets[hash] = bucket;
        }

        // Look for existing key
        const node = this.findNodeInBucket(bucket, key);
        if (node) {
            // Update existing key
            node.value[1] = value;  
        } else {
            // Insert new key pair
            bucket.append([key, value]);
            this.size++;
        }
    }

    // Get a value from a bucket at a given key
    get(key){
        const hash = this.hash(key);
        const bucket = this.buckets[hash];
        if (!bucket) return undefined;

        const node = this.findNodeInBucket(bucket, key);
        return node ? node.value[1] : undefined;
    }

    // Get a boolean while trying to access a key
    has(key){
        const bucket = this.buckets[this.hash(key)];
        if (!bucket) return false;
        return !!this.findNodeInBucket(bucket, key);
    }

    // Remove a value based on the key
    remove(key){
        const hash = this.hash(key);
        let bucket = this.buckets[hash];
        const node = this.findNodeInBucket(bucket, key);

        if(node) {
            bucket.deleteValue(node.value);
            if(bucket.len === 0){
                delete this.buckets[hash];
            }
            this.size--;
            return true;
        }
        return false;
    }

    // Return hashmap size
    length(){
        return this.size;
    }

    // Reset hashmap and set a new capacity
    clear(cap = this.capacity){
        this.buckets = [];
        this.size = 0;
        this.capacity = cap;
    }

    // Return all the keys 
    keys(){
        let keys = [];
        this.buckets.forEach(ll => {
            let node = ll.head;
            while(node != null){
                keys.push(node.value[0]);
                node = node.nextNode;
            }
        });
        return keys;
    }

    // Return all values 
    values(){
        let values = [];
        this.buckets.forEach(ll => {
            let node = ll.head;
            while(node != null){
                values.push(node.value[1]);
                node = node.nextNode;
            }
        });
        return values;
    }

    // Return all key pairs
    entries(){
        let pairs = [];
        this.buckets.forEach(ll => {
            let node = ll.head;
            while(node != null){
                pairs.push(node.value);
                node = node.nextNode;
            }
        });
        return pairs;
    }
}

// Helpers for testing
const sortEntries = (arr) => [...arr].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
const sortStrings = (arr) => [...arr].sort((a, b) => String(a).localeCompare(String(b)));

const assertEq = (name, got, expected) => {
  const pass = JSON.stringify(got) === JSON.stringify(expected);
  if (pass) console.log(`✅ ${name} passed`);
  else {
    console.error(`❌ ${name} failed`);
    console.log('expected:', expected);
    console.log('got     :', got);
  }
};

const fromArray = (pairs) => {
  const hm = new HashMap();
  for (const [k, v] of pairs) hm.set(k, v);
  return hm;
};

// Test data
const lis = [
  ['apple', 'red'],
  ['banana', 'yellow'],
  ['carrot', 'orange'],
  ['dog', 'brown'],
  ['elephant', 'gray'],
  ['frog', 'green'],
  ['grape', 'purple'],
  ['hat', 'black'],
  ['ice cream', 'white'],
  ['jacket', 'blue'],
];

// Tests
(() => {
  // Set + Entries
  const hm1 = fromArray(lis);
  assertEq('Set/Entries',
    sortEntries(hm1.entries()),
    sortEntries(lis)
  );

  // Get
  const hm2 = fromArray(lis);
  assertEq('Get existing', hm2.get('banana'), 'yellow');
  assertEq('Get missing', hm2.get('nope'), undefined);

  // Has
  const hm3 = fromArray(lis);
  assertEq('Has existing', hm3.has('grape'), true);
  assertEq('Has missing', hm3.has('nope'), false);

  // Remove
  const hm4 = fromArray(lis);
  assertEq('Remove existing', hm4.remove('hat'), true);
  assertEq('Remove reflects missing', hm4.get('hat'), undefined);
  assertEq('Remove missing', hm4.remove('hat'), false);

  // Length
  const hm5 = fromArray(lis);
  assertEq('Length', hm5.length(), lis.length);

  // Keys
  const hm6 = fromArray(lis);
  assertEq('Keys',
    sortStrings(hm6.keys()),
    sortStrings(lis.map(([k]) => k))
  );

  // Values
  const hm7 = fromArray(lis);
  assertEq('Values',
    sortStrings(hm7.values()),
    sortStrings(lis.map(([, v]) => v))
  );

  // Clear
  const hm8 = fromArray(lis);
  hm8.clear(16);
  assertEq('Clear -> length 0', hm8.length(), 0);
  assertEq('Clear -> entries empty', hm8.entries(), []);

  // Update should not increase size
  const hm9 = fromArray(lis);
  const sizeBefore = hm9.length();
  hm9.set('banana', 'UPDATED'); 
  assertEq('Update size unchanged', hm9.length(), sizeBefore);
  assertEq('Update get', hm9.get('banana'), 'UPDATED');
})();