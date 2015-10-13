// Red Black Tree
// References:
//  *   http://www.growingwiththeweb.com/2012/12/data-structure-red-black-tree.html
var sketch = function (p) {
    var tree = redBlackTree(),
        values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (var i = 0; i < values.length; i++) { tree.add(values[i]); }
    };

    p.draw = function () {
        p.background(0);
        console.log('count: ' + tree.size());
        console.log('root: ' + tree.root.key);
        console.log('root left: ' + tree.root.getLeft().key + " | root right: " + tree.root.getRight().key);
        console.log(tree.root.getLeft().key + ' left: ' + tree.root.getLeft().getLeft().key + " | " + tree.root.getLeft().key + " right: " + tree.root.getLeft().getRight().key);
        console.log(tree.root.getRight().key + ' left: ' + tree.root.getRight().getLeft().key + " | " + tree.root.getRight().key + " right: " + tree.root.getRight().getRight().key);
        console.log(tree.root.getRight().getLeft().key + ' left: ' + tree.root.getRight().getLeft().getLeft().key + " | " + tree.root.getRight().getLeft().key + " right: " + tree.root.getRight().getLeft().getRight().key);
        console.log(tree.root.getRight().getRight().key + ' left: ' + tree.root.getRight().getRight().getLeft().key + " | " + tree.root.getRight().getRight().key + " right: " + tree.root.getRight().getRight().getRight().key);
        console.log('in-order');
        tree.traverseInOrder(function(k) { console.log(k); } );
        console.log('pre-order');
        tree.traversePreOrder(function(k) { console.log(k); } );
        console.log('post-order');
        tree.traversePostOrder(function(k) { console.log(k); } );
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // Red-black tree via parasitic inheritance.
    function redBlackTree(customCompare) {
        var that = binaryTree();
        that.nodeCount = 0;
        that.add = function(k) {
            var parent,
                n = that.root;
            while (n && !n.isNil()) {
                parent = n;
                var compare = that.compare(k, parent.key);
                if (compare === 0) { return false; }
                if (compare < 0) { n = parent.getLeft(); }
                else { n = parent.getRight(); }
            }
            if (!parent) {
                n = node(k);
                that.root = n;
            } else {
                n.parent = parent;
                n.key = k;
            }
            n.color = 'red';
            that.insertFixup(n);
            that.nodeCount++;
            return true;
        };
        // that.remove = function(k) {
        //     var current = that.search(k),
        //         x, y;
        //     if (!current) { return false; }
        //     that.nodeCount--;
        //     if (current.getLeft().isNil() || current.getRight().isNil()) { y = current; }
        //     else { y = that.treeSuccessor(current); }
        //     if (!y.getLeft.isNil()) { x = y.getLeft(); }
        //     else { x = y.getRight(); }
        //     x.parent = y.parent;
        //     if (!y.parent) { that.root = x; }
        //     else {
        //         if (y === y.parent.getLeft()) { y.parent.left = x; }
        //         else { y.parent.right = x; }
        //     }
        //     if (y !== current) { current.key = y.key; }
        //     if (y.color === 'black') { that.deleteFixUp(); }
        //     return true;
        // };
        // that.deleteFixUp = function(n) {
        //     while (n !== that.root && n.color === 'black') {
        //         var w;
        //         if (n === n.parent.getLeft()) {
        //             w = n.parent.getRight();
        //             if (w.color === 'red') {
        //                 w.color = 'black';
        //                 n.parent.color = 'red';
        //                 that.rotateLeft(n.parent);
        //             }
        //             if (w.getLeft().color == 'black' && w.getRight().color === 'black') {
        //                 w.color = 'red';
        //                 n = n.parent;
        //             } else {
        //                 if (w.getRight().color === 'black') {
        //                     w.getLeft().color = 'black';
        //                     w.color = 'red';
        //                     that.rotateRight(w);
        //                     w = n.parent.getRight();
        //                 }
        //                 w.color = n.parent.color;
        //                 n.parent.color = 'black';
        //                 w.getRight().color = 'black';
        //                 that.rotateLeft(n.parent);
        //                 n = that.root;
        //             }
        //         } else {
        //             w = n.parent.getLeft();
        //             if (w.color === 'red') {
        //                 w.color = 'black';
        //                 n.parent.color = 'red';
        //                 that.rotateRight(n.parent);
        //             }
        //             if (w.getRight().color === 'black' && w.getLeft().color === 'black') {
        //                 w.color = 'red';
        //                 n = n.parent;
        //             } else {
        //                 if (w.getLeft.color === 'black') {
        //                     w.getRight().color = 'black';
        //                     w.color = 'red';
        //                     that.rotateLeft(w);
        //                     w = n.parent.getLeft();
        //                 }
        //                 w.color = n.parent.color;
        //                 n.parent.color = 'black';
        //                 w.getLeft().color = 'black';
        //                 that.rotateRight(n.parent);
        //                 n = that.root;
        //             }
        //         }
        //     }
        //     n.color = 'black';
        // };
        that.insertFixup = function(n) {
            while (n.parent && n.parent.parent && n.parent.color === 'red') {
                var uncle;
                if (n.parent === n.parent.parent.getLeft()) {
                    uncle = n.parent.parent.getRight();
                    if (uncle.color === 'red') {
                        n.parent.color = 'black';
                        uncle.color = 'black';
                        n = n.parent.parent;
                        n.color = 'red';

                    } else {
                        if (n === n.parent.getRight()) {
                            n = n.parent;
                            that.rotateLeft(n);
                        }
                        n.parent.color = 'black';
                        n.parent.parent.color = 'red';
                        that.rotateRight(n.parent.parent);
                    }
                } else if (n.parent == n.parent.parent.getRight()) {
                    uncle = n.parent.parent.getLeft();

                    if (uncle.color === 'red') {
                        n.parent.parent.color = 'black';
                        uncle.color = 'black';
                        n = n.parent.parent;
                        n.color = 'red';
                    } else {
                        if (n === n.parent.getLeft()) {
                            n = n.parent;
                            that.rotateRight(n);
                        }
                        n.parent.color = 'black';
                        n.parent.parent.color = 'red';
                        that.rotateLeft(n.parent.parent);
                    }
                }
            }
            that.root.color = 'black';
        };
        that.rotateLeft = function(x) {
            var y = x.getRight();
            x.right = y.getLeft();
            if (y.getLeft().key !== undefined) { y.getLeft().parent = x; }
            y.parent = x.parent;
            if (!x.parent) { that.root = y; }
            else {
                if (x === x.parent.getLeft()) { x.parent.left = y; }
                else { x.parent.right = y; }
            }
            y.left = x;
            x.parent = y;
        };
        that.rotateRight = function(x) {
            var y = x.getLeft();
            x.left = y.getRight();
            if (y.getRight().key !== undefined) { y.getRight().parent = x; }
            y.parent = x.parent;
            if (!x.parent) { that.root = y; }
            else {
                if (x === x.parent.getLeft()) { x.parent.left = y; }
                else { x.parent.right = y; }
            }
            y.right = x;
            x.parent = y;
        };
        that.treeSuccessor = function(n) {
            var successor = n.parent;
            if (n.getRight() && !n.isNil()) { return that.treeMin(n.getRight()); }
            while (successor && !successor.isNil() && n === successor) {
                n = successor;
                successor = n.parent;
            }
            return successor;
        };
        that.treeMin = function(n) {
            while (!n.isNil() && !n.getLeft().isNil()) {
                n = n.getLeft();
            }
            return n;
        };
        that.search = function(k) {
            var current = that.root;
            if (!current) { return undefined; }
            while (true) {
                if (that.compare(k, current.key) < 0) {
                    if (current.getLeft().key === undefined) { return undefined; }
                    current = current.getLeft();
                } else if (that.compare(k, current.key) > 0) {
                    if (current.getRight().key === undefined) { return undefined; }
                    current = current.getRight();
                } else { return current; }
            }
        };
        // If no custom compare provided, use default.
        if (customCompare) {
            that.compare = customCompare;
        } else {
            that.compare = function(a, b) {
                if (a > b) { return 1; }
                if (a < b) { return -1; }
                return 0;
            };
        }
        // The rest of these methods are not strictly needed.
        that.contains = function(k) {
            return !!that.search(k);
        };
        that.isEmpty = function() { return !that.nodeCount; };
        that.size = function() { return that.nodeCount; };
        that.findMax = function() {};
        that.findMin = function() {};
        return that;
    }

    // Base binary tree
    function binaryTree() {
        return {
            root: undefined,
            // visit is a function that takes a node's key.
            // Pre-order: Root, left subtree, right subtree.
            traversePreOrder: function(visit) {
                if (!this.root) { return; }
                var parentStack = [];
                parentStack.push(this.root);
                // Note on do-while loops.
                // do block executes once before condition is checked.
                // Loop then continues until while condition is false.
                do {
                    var top = parentStack.pop();
                    if (top.key !== undefined) {
                        visit(top.key);
                    }
                    // visit(top.key);
                    if (top.right) { parentStack.push(top.right); }
                    if (top.left) { parentStack.push(top.left); }
                } while (parentStack.length);
            },
            // In-order: Left subtree, root, right subtree.
            traverseInOrder: function(visit) {
                var parentStack = [],
                    current = this.root;
                while (parentStack.length || current) {
                    if (current) {
                        parentStack.push(current);
                        current = current.left;
                    } else {
                        current = parentStack.pop();
                        if (current.key !== undefined) {
                            visit(current.key);
                        }
                        // visit(current.key);
                        current = current.right;
                    }
                }
            },
            // Post-order: Left subtree, right subtree, root.
            traversePostOrder: function(visit) {
                var parentStack = [],
                    current = this.root,
                    lastVisited;
                while (parentStack.length || current) {
                    if (current) {
                        parentStack.push(current);
                        current = current.left;
                    } else {
                        var next = parentStack[parentStack.length - 1];
                        if (next.right && lastVisited !== next.right) {
                            current = next.right;
                        } else {
                            parentStack.pop();
                            if (next.key !== undefined) {
                                visit(next.key);
                            }
                            // visit(next.key);
                            lastVisited = next;
                        }
                    }
                }
            },
        }
    }

    // Red-black node
    function node(k, p) {
        // Note on javascript ternary operator.
        // condition ? result-if-true : result-if-false
        var c = (k === undefined ? 'black' : 'red');
        return {
            key: k,
            parent: p,
            color: c,
            left: undefined,
            right: undefined,
            removeChild: function(n) {
                if (this.left == n) { this.left == undefined; }
                if (this.right == n) {this.right == undefined; }
            },
            getLeft: function() {
                if (!this.left) { this.left = node(undefined, this); }
                return this.left;
            },
            getRight: function() {
                if (!this.right) {this.right = node(undefined, this); }
                return this.right;
            },
            isNil: function() {
                return this.key === undefined;
            },
        }
    };
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');