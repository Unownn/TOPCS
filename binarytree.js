export class Node {
  constructor(value){
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class Tree {
  constructor(){
    this.root = undefined;
  }

  // Wrap the tree building in its own function
  buildTreeRec(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);

    node.left = this.buildTreeRec(array.slice(0, mid));
    node.right = this.buildTreeRec(array.slice(mid + 1));

    return node;
  }

  // Build a binary try by passing in an array. Sort, remove dupes, build balanced tree
  buildTree(array) {
    // Handle invalid or empty input
    if (!array || array.length === 0) return null;

    // Sort and remove duplicates 
    array = [...new Set(array)].sort((a, b) => a - b);

    this.root = this.buildTreeRec(array);
    return this.root;
  }

  // Insert value in the tree
  insert(value){
    if(!this.root){
      this.root = new Node(value);
      return true;
    }

    // Iterate the tree -> go left if smaller, right if bigger
    let curr = this.root;
    while(curr !== null){
      if(curr.value === value){return false;}
      if(value > curr.value){
        if(curr.right === null){
          curr.right = new Node(value);
          return true;
        }
        curr = curr.right;
      }
      else if(value < curr.value){
        if(curr.left === null){
          curr.left = new Node(value);
          return true;
        }
        curr = curr.left;
      }
    }
    return false;
  }

  // Delete given value -> returns a new root
  deleteItem(value) {
    this.root = this.deleteRec(this.root, value);
  }

  // recursive delete: returns the (possibly new) root of this subtree
  deleteRec(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteRec(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.deleteRec(node.right, value);
      return node;
    }

    // value === node.value  -> delete this node

    // Case 1: no children
    if (!node.left && !node.right) return null;

    // Case 2: one child
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    // Case 3: two children
    // Replace with inorder successor (min in right subtree)
    const succ = this.minNode(node.right);
    node.value = succ.value;                   // copy successor's value
    node.right = this.deleteRec(node.right, succ.value); // delete successor node
    return node;
  }

  // smallest node in a (non-null) subtree
  minNode(node) {
      while (node.left) node = node.left;
      return node;
  }

  // Find a given value
  findValue(value){
    if(!this.root){
      return false;
    }

    // Iterate the tree towards the value
    let curr = this.root;
    while(curr !== null){
      if(curr.value === value){return true;}
      if(value > curr.value){
        curr = curr.right;
      }
      else if(value < curr.value){
        curr = curr.left;
      }
    }
    return false;
  }

  // Get values based on levels
  levelOrderForEach(callback){
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    if (!this.root) return;

    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift(); 
      callback(node);             

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  // Get values in sorted order
  inOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!node) return;

    this.inOrderForEach(callback, node.left);
    callback(node);                      
    this.inOrderForEach(callback, node.right);
  }
  // Get lefts first
  preOrderForEach(callback, node = this.root){
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!node) return;

    callback(node);                      
    this.inOrderForEach(callback, node.left);  
    this.inOrderForEach(callback, node.right);

  }

  // Get values between recursion
  postOrderForEach(callback, node = this.root){
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!node) return;

    this.inOrderForEach(callback, node.left);                     
    this.inOrderForEach(callback, node.right);     
    callback(node);              
  }

  // Returns depth of the node with given value
  depth(value){
    if(!this.root){
      return null;
    }

    // Iterate the tree towards the value
    let iterator = 0; 
    let curr = this.root;
    while(curr !== null){
      if(curr.value == value){return iterator;}
      if(value > curr.value){
        curr = curr.right;
        iterator++;
      }
      else if(value < curr.value){
        curr = curr.left;
        iterator++;
      }
    }
  }

  // Returns height of the node with given value
  height(value) {
    const findNode = (node, val) => {
      if (!node) return null;
      if (node.value === val) return node;
      return val < node.value
        ? findNode(node.left, val)
        : findNode(node.right, val);
    };

    const getHeight = (node) => {
      if (!node) return -1; 
      const leftH = getHeight(node.left);
      const rightH = getHeight(node.right);
      return Math.max(leftH, rightH) + 1;
    };

    const node = findNode(this.root, value);
    if (!node) return null; 
    return getHeight(node);
  }

  // Check if tree is balanced
  isBalanced(){
    let node = this.root;
    const check = (n) => {
      if (!n) return 0;

      const leftHeight = check(n.left);
      if (leftHeight === -1) return -1;

      const rightHeight = check(n.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) return -1;

      return Math.max(leftHeight, rightHeight) + 1;
    };

    return check(node) !== -1;
  }

  // Rebalance the tree
  rebalance(){  
    if (!this.root) return;
    if (this.isBalanced && this.isBalanced()) return; 
    let inOrderArr = [];
    this.inOrderForEach(node => inOrderArr.push(node.value));
    this.buildTree(inOrderArr);
  }
}



const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

const arr = [3, 7, 4, 9, 1, 2, 5, 8, 0, 10];
const binaryTree = new Tree();
binaryTree.buildTree(arr);
