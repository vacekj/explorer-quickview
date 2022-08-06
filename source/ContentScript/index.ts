console.log("helloworld from content script");
import { browser, Tabs } from "webextension-polyfill-ts";

const txRegex = new RegExp(/^0x([A-Fa-f0-9]{64})$/g);
const addressRegex = /(0x[a-fA-F\d]{40})\b/g;

var replaceTextInNode = function(parentNode: Node) {
  for (var i = parentNode.childNodes.length - 1; i >= 0; i--) {
    var node = parentNode.childNodes[i];

    if (node.nodeType == Node.TEXT_NODE && node.textContent!.match(addressRegex) !== null) {
      let linkified = node.textContent!.replace(addressRegex, (match) => {
        console.log(match);
        return `<a href="https://etherscan.io/address/${match}">${match}</a>`;
      });
      var replacementNode = document.createElement("span");
      // @ts-ignore
      replacementNode.innerHTML = linkified;
      node.parentNode!.insertBefore(replacementNode, node);
      node.parentNode!.removeChild(node);
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      //  Check this node's child nodes for text nodes to act on
      replaceTextInNode(node);
    }
  }
};

(new MutationObserver(check)).observe(document, { childList: true, subtree: true });

function check(change: MutationRecord[], observer: MutationObserver) {
  observer.disconnect();
  change.forEach(n => {
    replaceTextInNode(n.target);
  });
  observer.observe(document, { childList: true, subtree: true });
}

export {};
