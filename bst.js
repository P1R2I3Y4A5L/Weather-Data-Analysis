class Node {
    constructor(city, temperature) {
        this.city = city;
        this.temperature = temperature;
        this.left = null;
        this.right = null;
    }
}

class WeatherBST {
    constructor() {
        this.root = null;
    }

    insert(city, temperature) {
        const newNode = new Node(city, temperature);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.temperature < node.temperature) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    getMinNode() {
        if (!this.root) return null;
        let current = this.root;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    getMaxNode() {
        if (!this.root) return null;
        let current = this.root;
        while (current.right !== null) {
            current = current.right;
        }
        return current;
    }

    // Traverse tree in-order to get sorted list (Ascending order)
    inOrderTraverse() {
        const result = [];
        this.inOrderTraverseNode(this.root, result);
        return result;
    }

    inOrderTraverseNode(node, result) {
        if (node !== null) {
            this.inOrderTraverseNode(node.left, result);
            result.push({ city: node.city, temperature: node.temperature });
            this.inOrderTraverseNode(node.right, result);
        }
    }
}
