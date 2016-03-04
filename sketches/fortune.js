// REFERENCE: http://blog.ivank.net/fortunes-algorithm-and-implementation.html

var sketch = function (p) {
    var sites = [],
        queue = [],
        beachline = BST(),
        edges = [];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Populate sites
        for (var i = 0; i < 100; i++) {
            sites.push(p.createVector(Math.random() * p.width, Math.random() * p.height)); 
        }
        // Populate queue
        for (var i = 0; i < sites.length; i++) {
            var s = sites[i],
                e = {point: s, event: 'site' };
            queue.push(e);
        }
        //Sort queue by y-value ascending
        queue.sort(function(a, b){ return a.point.y - b.point.y})
        // Process queue
        while (queue.length > 0) {
            var e = queue.pop();
            if (e.event === 'site') {
                //Add parabola 
            } else {
                // Remove parabola
            }
        }

    };

    p.draw = function () {
        p.background(0);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function addParabola(u) {
        var par = {site: u}; // arc under point u
        // if () { } 
        // if (par has its circle event, when it is removed form the beachline) remove this event form the queue
        var a, b, c;

    }

    function removeParabola() {

    }

    function checkCircleEvent() {

    }

    function BST() {
        function Node(p, val) {
            return {
                parent: p,
                left: null,
                right: null,
                value: val,
            };
        }
        return {
            root: null,
            minVal: function(node) {
                if (node.left === null) { return node.value; }
                return this.minVal(node.left);
            },
            search: function(val, node) {
                if (node === undefined) { node = this.root; }
                if (node.value === val) { return node; }
                if (val.x < node.value.x) {
                    if (node.left === null) { return null; }
                    return this.search(val, node.left);
                }
                if (node.right === null) { return null; }
                return this.search(val, node.right);
            },
            add: function(val, node) {
                // Check input node
                if (node === undefined) {
                    node = this.root;
                }
                // Assign to root
                if (this.root === null) {
                    this.root = Node(null, val);
                    return;
                } 
                // Add to left child
                if (val.x < node.value.x) {
                    if (node.left === null) {
                        node.left = Node(node, val);
                        return;
                    }
                    this.add(val, node.left);
                    return;
                }
                // Add to right
                if (node.right == null) {
                    node.right = Node(node, val);
                    return;
                }
                this.add(val, node.right);
                return;
            },
            remove: function(val, node) {
                // Check input node
                if (node === undefined) {
                    node = this.root;
                }
                var target = this.search(val);
                if (target === null) { console.log('FUCK: ' + val + ' DNE.'); }
                // Case 1: Target has no children.
                if (target.left === null && target.right === null) {
                    if (target.parent.left === target) { target.parent.left = null; }
                    else { target.parent.right = null; }
                }
                // Case 2: Target has one child.
                if (target.left !== null && target.right === null) {
                    if (target.parent.left === target) { target.parent.left = target.left; }
                    else { target.parent.right = target.left; }
                } else if (target.right !== null && target.left === null) {
                    if (target.parent.left === target) { target.parent.left = target.right; }
                    else { target.parent.right = target.right; }
                }
                // Case 3: Target has two children.
                if (target.left !=== null && target.right !=== null) {
                    var min = this.minVal(target.right);
                    target.value = min;
                    this.remove(min, target.right);
                }
            },
        };
    }


// for each site
//    {
//       create a site event e, 
//       e.point = current site, insert e into queue
//    }
//    while queue is not empty
//    {
//       e = get the first event from the queue
//       if its site event : AddParabola( e.point )
//       else : RemoveParabola( e.parabola );
//    }
//    // done!!! :) 

//    function AddParabola ( point u )
//    {
//       par = arc under point u;
//       if (par has its circle event, when it is removed from the beachline)
//          remove this event from the queue
//       new arcs a, b, c;
//       b.site = u;
//       a.site = c.site = par.site; // site of arc is a focus of arc
//       xl, xr  = left and right edges, which comes from point on par under u
//       xl is a normal to  (a.site, b.site);
//       xr is a normal to (b.site, c.site);
//       replace par by the sequence a, xl, b, xr, c
//       CheckCircleEvent(a);
//       CheckCircleEvent(c);
//    }
//    function RemoveParabola ( Parabola p )
//    {
//       l = an arc lef to p;
//       r = an arc on the right from p;
//       if (l or r have their Circle events) remove these events from the queue
//       s = the circumcenter between l.site, p.site and r.site
//       x = new edge, starts at s, normal to (l.site, r.site)
//       finish two neighbour edges xl, xr at point s
//       replace a sequence xl, p, xr by new edge x
//       CheckCircleEvent(l);
//       CheckCircleEvent(r);
//    }
//    function CheckCircleEvent(Parabola p)
//    {
//       l = arc on the left to p;
//       r = arc on the right to p;
//       xl, xr = edges by the p
//       when there is no l  OR no r  OR  l.site=r.site  RETURN
//       s = middle point, where xl and xr cross each other
//       when there is no s (edges go like\ /) RETURN
//       r = distance between s an p.site (radius of curcumcircle)
//       if s.y + r is still under the sweepline  RETURN
//       e = new circle event
//       e.parabola = p;
//       e.y = s.y + r;
//       add e into queue 
//    }

// Each leaf in the tree represents an arc. Each inner node is an edge between two arcs.
// If there is only one arc, the tree is only one leaf, root
// When we add a new arc into the tree (when a sweep line rolls over the new site), 
// the "right leaf" (the arc under the site being added) splits into two half-arcs 
// and a new arc is added between them. The "right leaf" becomes an inner node and 
// gets 2 children. Left child represents a left half-arc of a previous arc. Right 
// child is a subtree, which contains a newly added arc on the left and right half-
// arc of previous arc on the right.

// Removing an arc is also very easy. Its parent represents the left or the right 
// edge, some "higher predecesor" is the next edge. If currently removed arc is the
// left child, we replace the predecesor by the right child and vice versa. We 
// attach the new edge to the "higher predecesor".


}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');