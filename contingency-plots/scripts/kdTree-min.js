/**
 * k-d Tree JavaScript - V 1.01
 *
 * https://github.com/ubilabs/kd-tree-javascript
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
<<<<<<< HEAD
 */

 (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        factory(exports);
    } else {
        factory((root.commonJsStrict = {}));
    }
}(this, function (exports) {
  function Node(obj, dimension, parent) {
    this.obj = obj;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.dimension = dimension;
  }

  function kdTree(points, metric, dimensions) {

    var self = this;
    
    function buildTree(points, depth, parent) {
      var dim = depth % dimensions.length,
        median,
        node;

      if (points.length === 0) {
        return null;
      }
      if (points.length === 1) {
        return new Node(points[0], dim, parent);
      }

      points.sort(function (a, b) {
        return a[dimensions[dim]] - b[dimensions[dim]];
      });

      median = Math.floor(points.length / 2);
      node = new Node(points[median], dim, parent);
      node.left = buildTree(points.slice(0, median), depth + 1, node);
      node.right = buildTree(points.slice(median + 1), depth + 1, node);

      return node;
    }

    // Reloads a serialied tree
    function loadTree (data) {
      // Just need to restore the `parent` parameter
      self.root = data;

      function restoreParent (root) {
        if (root.left) {
          root.left.parent = root;
          restoreParent(root.left);
        }

        if (root.right) {
          root.right.parent = root;
          restoreParent(root.right);
        }
      }

      restoreParent(self.root);
    }
    
    // If points is not an array, assume we're loading a pre-built tree
    if (!Array.isArray(points)) loadTree(points, metric, dimensions);
    else this.root = buildTree(points, 0, null);

    // Convert to a JSON serializable structure; this just requires removing 
    // the `parent` property
    this.toJSON = function (src) {
      if (!src) src = this.root;
      var dest = new Node(src.obj, src.dimension, null);
      if (src.left) dest.left = self.toJSON(src.left);
      if (src.right) dest.right = self.toJSON(src.right);
      return dest;
    };

    this.insert = function (point) {
      function innerSearch(node, parent) {

        if (node === null) {
          return parent;
        }

        var dimension = dimensions[node.dimension];
        if (point[dimension] < node.obj[dimension]) {
          return innerSearch(node.left, node);
        } else {
          return innerSearch(node.right, node);
        }
      }

      var insertPosition = innerSearch(this.root, null),
        newNode,
        dimension;

      if (insertPosition === null) {
        this.root = new Node(point, 0, null);
        return;
      }

      newNode = new Node(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
      dimension = dimensions[insertPosition.dimension];

      if (point[dimension] < insertPosition.obj[dimension]) {
        insertPosition.left = newNode;
      } else {
        insertPosition.right = newNode;
      }
    };

    this.remove = function (point) {
      var node;

      function nodeSearch(node) {
        if (node === null) {
          return null;
        }

        if (node.obj === point) {
          return node;
        }

        var dimension = dimensions[node.dimension];

        if (point[dimension] < node.obj[dimension]) {
          return nodeSearch(node.left, node);
        } else {
          return nodeSearch(node.right, node);
        }
      }

      function removeNode(node) {
        var nextNode,
          nextObj,
          pDimension;

        function findMin(node, dim) {
          var dimension,
            own,
            left,
            right,
            min;

          if (node === null) {
            return null;
          }

          dimension = dimensions[dim];

          if (node.dimension === dim) {
            if (node.left !== null) {
              return findMin(node.left, dim);
            }
            return node;
          }

          own = node.obj[dimension];
          left = findMin(node.left, dim);
          right = findMin(node.right, dim);
          min = node;

          if (left !== null && left.obj[dimension] < own) {
            min = left;
          }
          if (right !== null && right.obj[dimension] < min.obj[dimension]) {
            min = right;
          }
          return min;
        }

        if (node.left === null && node.right === null) {
          if (node.parent === null) {
            self.root = null;
            return;
          }

          pDimension = dimensions[node.parent.dimension];

          if (node.obj[pDimension] < node.parent.obj[pDimension]) {
            node.parent.left = null;
          } else {
            node.parent.right = null;
          }
          return;
        }

        // If the right subtree is not empty, swap with the minimum element on the
        // node's dimension. If it is empty, we swap the left and right subtrees and
        // do the same.
        if (node.right !== null) {
          nextNode = findMin(node.right, node.dimension);
          nextObj = nextNode.obj;
          removeNode(nextNode);          
          node.obj = nextObj;
        } else {
          nextNode = findMin(node.left, node.dimension);
          nextObj = nextNode.obj;
          removeNode(nextNode);
          node.right = node.left;
          node.left = null;
          node.obj = nextObj;
        }

      }

      node = nodeSearch(self.root);

      if (node === null) { return; }

      removeNode(node);
    };

    this.nearest = function (point, maxNodes, maxDistance) {
      var i,
        result,
        bestNodes;

      bestNodes = new BinaryHeap(
        function (e) { return -e[1]; }
      );

      function nearestSearch(node) {
        var bestChild,
          dimension = dimensions[node.dimension],
          ownDistance = metric(point, node.obj),
          linearPoint = {},
          linearDistance,
          otherChild,
          i;

        function saveNode(node, distance) {
          bestNodes.push([node, distance]);
          if (bestNodes.size() > maxNodes) {
            bestNodes.pop();
          }
        }

        for (i = 0; i < dimensions.length; i += 1) {
          if (i === node.dimension) {
            linearPoint[dimensions[i]] = point[dimensions[i]];
          } else {
            linearPoint[dimensions[i]] = node.obj[dimensions[i]];
          }
        }

        linearDistance = metric(linearPoint, node.obj);

        if (node.right === null && node.left === null) {
          if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
            saveNode(node, ownDistance);
          }
          return;
        }

        if (node.right === null) {
          bestChild = node.left;
        } else if (node.left === null) {
          bestChild = node.right;
        } else {
          if (point[dimension] < node.obj[dimension]) {
            bestChild = node.left;
          } else {
            bestChild = node.right;
          }
        }

        nearestSearch(bestChild);

        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance);
        }

        if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
          if (bestChild === node.left) {
            otherChild = node.right;
          } else {
            otherChild = node.left;
          }
          if (otherChild !== null) {
            nearestSearch(otherChild);
          }
        }
      }

      if (maxDistance) {
        for (i = 0; i < maxNodes; i += 1) {
          bestNodes.push([null, maxDistance]);
        }
      }

      if(self.root)
        nearestSearch(self.root);

      result = [];

      for (i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1) {
        if (bestNodes.content[i][0]) {
          result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
        }
      }
      return result;
    };

    this.balanceFactor = function () {
      function height(node) {
        if (node === null) {
          return 0;
        }
        return Math.max(height(node.left), height(node.right)) + 1;
      }

      function count(node) {
        if (node === null) {
          return 0;
        }
        return count(node.left) + count(node.right) + 1;
      }

      return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
    };
  }

  // Binary heap implementation from:
  // http://eloquentjavascript.net/appendix2.html

  function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  BinaryHeap.prototype = {
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);
      // Allow it to bubble up.
      this.bubbleUp(this.content.length - 1);
    },

    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it sink down.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
      }
      return result;
    },

    peek: function() {
      return this.content[0];
    },

    remove: function(node) {
      var len = this.content.length;
      // To remove a value, we must search through the array to find
      // it.
      for (var i = 0; i < len; i++) {
        if (this.content[i] == node) {
          // When it is found, the process seen in 'pop' is repeated
          // to fill up the hole.
          var end = this.content.pop();
          if (i != len - 1) {
            this.content[i] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node))
              this.bubbleUp(i);
            else
              this.sinkDown(i);
          }
          return;
        }
      }
      throw new Error("Node not found.");
    },

    size: function() {
      return this.content.length;
    },

    bubbleUp: function(n) {
      // Fetch the element that has to be moved.
      var element = this.content[n];
      // When at 0, an element can not go up any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element;
          this.content[n] = parent;
          // Update 'n' to continue at the new position.
          n = parentN;
        }
        // Found a parent that is less, no need to move it further.
        else {
          break;
        }
      }
    },

    sinkDown: function(n) {
      // Look up the target element and its score.
      var length = this.content.length,
          element = this.content[n],
          elemScore = this.scoreFunction(element);

      while(true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) * 2, child1N = child2N - 1;
        // This is used to store the new position of the element,
        // if any.
        var swap = null;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N],
              child1Score = this.scoreFunction(child1);
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore)
            swap = child1N;
        }
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
              child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elemScore : child1Score)){
            swap = child2N;
          }
        }

        // If the element needs to be moved, swap it, and continue.
        if (swap != null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
        // Otherwise, we are done.
        else {
          break;
        }
      }
    }
  };
  
  this.kdTree = kdTree;
  
  exports.kdTree = kdTree;
  exports.BinaryHeap = BinaryHeap;
}));
=======
 */(function(e,t){if(typeof define==="function"&&define.amd){define(["exports"],t)}else if(typeof exports==="object"){t(exports)}else{t(e.commonJsStrict={})}})(this,function(e){function t(e,t,n){this.obj=e;this.left=null;this.right=null;this.parent=n;this.dimension=t}function n(e,n,i){function o(e,n,r){var s=n%i.length,u,a;if(e.length===0){return null}if(e.length===1){return new t(e[0],s,r)}e.sort(function(e,t){return e[i[s]]-t[i[s]]});u=Math.floor(e.length/2);a=new t(e[u],s,r);a.left=o(e.slice(0,u),n+1,a);a.right=o(e.slice(u+1),n+1,a);return a}function u(e){function t(e){if(e.left){e.left.parent=e;t(e.left)}if(e.right){e.right.parent=e;t(e.right)}}s.root=e;t(s.root)}var s=this;if(!Array.isArray(e))u(e,n,i);else this.root=o(e,0,null);this.toJSON=function(e){if(!e)e=this.root;var n=new t(e.obj,e.dimension,null);if(e.left)n.left=s.toJSON(e.left);if(e.right)n.right=s.toJSON(e.right);return n};this.insert=function(e){function n(t,r){if(t===null){return r}var s=i[t.dimension];if(e[s]<t.obj[s]){return n(t.left,t)}else{return n(t.right,t)}}var r=n(this.root,null),s,o;if(r===null){this.root=new t(e,0,null);return}s=new t(e,(r.dimension+1)%i.length,r);o=i[r.dimension];if(e[o]<r.obj[o]){r.left=s}else{r.right=s}};this.remove=function(e){function n(t){if(t===null){return null}if(t.obj===e){return t}var r=i[t.dimension];if(e[r]<t.obj[r]){return n(t.left,t)}else{return n(t.right,t)}}function r(e){function u(e,t){var n,r,s,o,a;if(e===null){return null}n=i[t];if(e.dimension===t){if(e.right!==null){return u(e.right,t)}return e}r=e.obj[n];s=u(e.left,t);o=u(e.right,t);a=e;if(s!==null&&s.obj[n]>r){a=s}if(o!==null&&o.obj[n]>a.obj[n]){a=o}return a}function a(e,t){var n,r,s,o,u;if(e===null){return null}n=i[t];if(e.dimension===t){if(e.left!==null){return a(e.left,t)}return e}r=e.obj[n];s=a(e.left,t);o=a(e.right,t);u=e;if(s!==null&&s.obj[n]<r){u=s}if(o!==null&&o.obj[n]<u.obj[n]){u=o}return u}var t,n,o;if(e.left===null&&e.right===null){if(e.parent===null){s.root=null;return}o=i[e.parent.dimension];if(e.obj[o]<e.parent.obj[o]){e.parent.left=null}else{e.parent.right=null}return}if(e.left!==null){t=u(e.left,e.dimension)}else{t=a(e.right,e.dimension)}n=t.obj;r(t);e.obj=n}var t;t=n(s.root);if(t===null){return}r(t)};this.nearest=function(e,t,o){function l(r){function d(e,n){f.push([e,n]);if(f.size()>t){f.pop()}}var s,o=i[r.dimension],u=n(e,r.obj),a={},c,h,p;for(p=0;p<i.length;p+=1){if(p===r.dimension){a[i[p]]=e[i[p]]}else{a[i[p]]=r.obj[i[p]]}}c=n(a,r.obj);if(r.right===null&&r.left===null){if(f.size()<t||u<f.peek()[1]){d(r,u)}return}if(r.right===null){s=r.left}else if(r.left===null){s=r.right}else{if(e[o]<r.obj[o]){s=r.left}else{s=r.right}}l(s);if(f.size()<t||u<f.peek()[1]){d(r,u)}if(f.size()<t||Math.abs(c)<f.peek()[1]){if(s===r.left){h=r.right}else{h=r.left}if(h!==null){l(h)}}}var u,a,f;f=new r(function(e){return-e[1]});if(o){for(u=0;u<t;u+=1){f.push([null,o])}}l(s.root);a=[];for(u=0;u<t;u+=1){if(f.content[u][0]){a.push([f.content[u][0].obj,f.content[u][1]])}}return a};this.balanceFactor=function(){function e(t){if(t===null){return 0}return Math.max(e(t.left),e(t.right))+1}function t(e){if(e===null){return 0}return t(e.left)+t(e.right)+1}return e(s.root)/(Math.log(t(s.root))/Math.log(2))}}function r(e){this.content=[];this.scoreFunction=e}r.prototype={push:function(e){this.content.push(e);this.bubbleUp(this.content.length-1)},pop:function(){var e=this.content[0];var t=this.content.pop();if(this.content.length>0){this.content[0]=t;this.sinkDown(0)}return e},peek:function(){return this.content[0]},remove:function(e){var t=this.content.length;for(var n=0;n<t;n++){if(this.content[n]==e){var r=this.content.pop();if(n!=t-1){this.content[n]=r;if(this.scoreFunction(r)<this.scoreFunction(e))this.bubbleUp(n);else this.sinkDown(n)}return}}throw new Error("Node not found.")},size:function(){return this.content.length},bubbleUp:function(e){var t=this.content[e];while(e>0){var n=Math.floor((e+1)/2)-1,r=this.content[n];if(this.scoreFunction(t)<this.scoreFunction(r)){this.content[n]=t;this.content[e]=r;e=n}else{break}}},sinkDown:function(e){var t=this.content.length,n=this.content[e],r=this.scoreFunction(n);while(true){var i=(e+1)*2,s=i-1;var o=null;if(s<t){var u=this.content[s],a=this.scoreFunction(u);if(a<r)o=s}if(i<t){var f=this.content[i],l=this.scoreFunction(f);if(l<(o==null?r:a)){o=i}}if(o!=null){this.content[e]=this.content[o];this.content[o]=n;e=o}else{break}}}};this.kdTree=n;e.kdTree=n;e.BinaryHeap=r})
>>>>>>> e22369b675f6381e1f8857d027d83c7afbbbb8a8
