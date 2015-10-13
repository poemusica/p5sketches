var sketch = function (p) {

    var l = doubleLinkedList();

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (var i = 0; i < 10; i++) {
            l.add(i);
        }
    };

    p.draw = function () {
        p.background(0);
        console.log('traverse');
        l.traverse();
        console.log('reverseTraverse');
        l.reverseTraverse();
        for (var i = 0; i < 10; i++) {
            var v = 9-i;
            console.log('remove ' + v);
            l.remove(v);
            console.log('traverse');
            l.traverse();
            console.log('reverseTraverse');
            l.reverseTraverse();
        }
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function doubleLinkedList() {
        return {
            head: null,
            tail: null,
            length: 0,
            add: function(value) {
                if (this.tail == null) {
                    this.head = node(value, null);
                    this.tail = this.head;
                } else {
                    prevTail = this.tail;
                    prevTail.next = node(value, prevTail);
                    this.tail = prevTail.next;
                }
                this.length++;
            },
            remove: function(value) {
                var n = this.head;
                // If removing head.
                if (this.head.data == value) {
                    // If list is only one node long.
                    if (this.head == this.tail) {
                        this.head = null;
                        this.tail = null;
                    } else {
                        this.head.next.prev = null;
                        this.head = this.head.next;
                    }
                    return;
                }
                // If removing tail.
                if (this.tail.data == value) {
                    this.tail.prev.next = null;
                    this.tail = this.tail.prev;
                }
                // Otherwise
                while (n != null) {
                    if (n.data == value) {
                        n.prev.next = n.next;
                        n.next.prev = n.prev;
                        break;
                    } else {
                        n = n.next;
                    }
                }
                return
            },
            traverse: function() {
                var n = this.head;
                while(n !== null) {
                    console.log(n.data);
                    n = n.next;
                };
            },
            reverseTraverse: function() {
                var n = this.tail;
                while (n != null) {
                    console.log(n.data);
                    n = n.prev;
                }
            }
        }
    }

    function node(d, p) {
        return {
            data: d,
            prev: p,
            next: null,
        }
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');