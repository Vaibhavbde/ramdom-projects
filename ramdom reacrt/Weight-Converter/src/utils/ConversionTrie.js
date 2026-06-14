export default class ConversionTrie {
  constructor() {
    this.root = {};
  }

  insert(conversion) {
    let node = this.root;
    for (let char of conversion.text) {
      if (!node[char]) node[char] = {};
      node = node[char];
    }
    node.isEnd = true;
    node.data = conversion; // store metadata like timestamp, units
  }

  exists(conversionText) {
    let node = this.root;
    for (let char of conversionText) {
      if (!node[char]) return false;
      node = node[char];
    }
    return node.isEnd === true;
  }

  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node[char]) return [];
      node = node[char];
    }
    const results = [];
    this._dfs(node, prefix, results);
    return results.map((r) => r.data || { text: r });
  }

  _dfs(node, prefix, results) {
    if (node.isEnd) results.push(node);
    for (let char in node) {
      if (char !== "isEnd" && char !== "data") {
        this._dfs(node[char], prefix + char, results);
      }
    }
  }

  // For persistence
  serialize() {
    return JSON.stringify(this.root);
  }

  static deserialize(json) {
    const trie = new ConversionTrie();
    trie.root = JSON.parse(json);
    return trie;
  }
}
