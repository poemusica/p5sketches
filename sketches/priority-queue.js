// Priority queue as a binary (min) heap.
// Resources:
//  *   http://eloquentjavascript.net/1st_edition/appendix2.html

var sketch = function (p) {
    var heap,
        prev = "";

    p.setup = function () {
        var scoreFunction = function(a) { return a; }
        p.createCanvas(p.windowWidth, p.windowHeight);
        heap = binaryHeap(scoreFunction);
        frames = [];
    };

    p.draw = function () {
        p.background(0);
        p.textSize(14);
        p.textFont("Helvetica");
        p.stroke(255);
        p.fill(255);
        var message = 'Push to heap with + key. Pop from heap with - key.';
        p.text('current', p.width/4, p.height/4 - 14, p.textWidth('current') * 2, 14);
        p.text(heap.content, p.width/4, p.height/4, 70, 80);
        p.text('previous', p.width/4, p.height/4 - (14*5), p.textWidth('previous') * 2, 14);
        p.text(prev, p.width/4, p.height/4 - (14*4), p.textWidth(prev) * 2, 14);
        p.text(message, p.width/4, p.height/4 - (14*8), p.textWidth(message) * 2, 14);
    };

    p.keyTyped = function() {
        if (p.key === '+') {
            var value = Math.floor(Math.random() * 100 + 1);
            prev = heap.content.slice();
            console.log('push ' + value);
            heap.push(value);
        } else if (p.key === '-') {
            prev = heap.content.slice();
            heap.pop();
        }
        return false;
    };


    function binaryHeap(scoreFunction) {
        return {
            content: [],
            scoreFxn: scoreFunction,
            size: function() {
                return this.content.length;
            },
            push: function(element) {
                // Add new element to end of array and let it bubble up.
                this.content.push(element);
                this.bubbleUp(this.content.length-1);
            },
            pop: function() {
                // Return first element of array.
                // Put the end element at the start and let it sink down.
                var result = this.content[0],
                    end = this.content.pop();
                if (this.content.length > 0) {
                    this.content[0] = end;
                    this.sinkDown(0);
                }
                return result;
            },
            remove: function(value) {
                // Search array to find the element with the target value.
                var length = this.content.length;
                for (var i = 0; i < length; i++) {
                    if (this.content[i] == value) {
                        // When found, pop and fill the first element.
                        var end = this.content.pop();
                        // If the popped element is the target element, stop.
                        if (i == length-1) { break; }
                        // Otherwise, replace target element with popped one
                        // and let it bubble up or sink down.
                        else {
                            this.content[i] = end;
                            this.bubbleUp(i);
                            this.sinkDown(i);
                            break;
                        }
                    }
                }
            },
            bubbleUp: function(index) {
                // Get target element and its score.
                var element = this.content[index],
                    score = this.scoreFxn(element);
                while (index > 0) {
                    // Compute parent's index and get parent.
                    var parentIndex = Math.floor((index + 1)/2) - 1,
                        parent = this.content[parentIndex];
                    // If element's score is greater than its parent's, stop.
                    if (score >= this.scoreFxn(parent)) { break; }
                    // Otherwise, swap the target element and it's parent.
                    this.content[parentIndex] = element;
                    this.content[index] = parent;
                    index = parentIndex;
                }
            },
            sinkDown: function(index) {
                var length = this.content.length,
                    element = this.content[index],
                    elemScore = this.scoreFxn(element);
                while (true) {
                    // Compute indexes of child elements.
                    var child2index = (index + 1) * 2,
                        child1index = child2index - 1,
                        swap = null;
                    // If first child exists...
                    if (child1index < length) {
                        // Get first child and its score.
                        var child1 = this.content[child1index],
                            child1Score = this.scoreFxn(child1);
                        // If first child's score is less than element's, swap needed.
                        if (child1Score < elemScore) { swap = child1index; }
                    }
                    // If second child exists...
                    if (child2index < length) {
                        // Get second child and its score.
                        var child2 = this.content[child2index],
                            child2Score = this.scoreFxn(child2),
                            // (Note on ternary operator syntax:
                            // condition ? result if condition true : result if condition false.)
                            score = (swap == null ? elemScore : child1Score);
                        if (child2Score < score) { swap = child2index; }
                    }
                    // If no swap needed, stop.
                    if (swap == null) { break; }
                    // Otherwise swap element with child and continue.
                    this.content[index] = this.content[swap];
                    this.content[swap] = element;
                    index = swap;
                }
            },
        }
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');