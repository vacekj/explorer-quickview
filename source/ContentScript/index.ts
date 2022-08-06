// @ts-ignore
import PouchDB from "pouchdb";
import { v4 } from "uuid";
import { browser } from "webextension-polyfill-ts";

const txRegex = new RegExp(/(0x[A-Fa-f\d]{64})/g);
const addressRegex = new RegExp(/(0x[a-fA-F\d]{40})\b/g);

var replaceTextInNode = function(parentNode: Node) {
  for (let i = parentNode.childNodes.length - 1; i >= 0; i--) {
    const node = parentNode.childNodes[i];

    if (node.nodeType == Node.TEXT_NODE && node.textContent!.match(addressRegex) !== null) {
      let linkified = node.textContent!.replace(addressRegex, (match) => {
        /* Store address and URL in history */
        browser.runtime.sendMessage({ type: "address", value: match, url: window.location.href });
        return `<a href="https://etherscan.io/address/${match}">${match}</a>`;
      });

      const replacementNode = document.createElement("span");
      replacementNode.innerHTML = linkified;
      node.parentNode!.insertBefore(replacementNode, node);
      node.parentNode!.removeChild(node);
    } else if (node.nodeType == Node.TEXT_NODE && node.textContent!.match(txRegex) !== null) {
      let linkified = node.textContent!.replace(txRegex, (match) => {
        browser.runtime.sendMessage({ type: "tx", value: match, url: window.location.href });
        return `<a href="https://etherscan.io/tx/${match}">${match}</a>`;
      });

      const replacementNode = document.createElement("span");
      replacementNode.innerHTML = linkified;
      node.parentNode!.insertBefore(replacementNode, node);
      node.parentNode!.removeChild(node);
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      replaceTextInNode(node);
    }
  }
};

/* Monitor DOM for changes and replace dynamically */
(new MutationObserver(check)).observe(document, { childList: true, subtree: true });

function check(change: MutationRecord[], observer: MutationObserver) {
  /* Disconnect to prevent infinite loop */
  observer.disconnect();
  change.forEach(n => {
    replaceTextInNode(n.target);
  });
  /* Re-attach observer again in case this node tree changes again */
  observer.observe(document, { childList: true, subtree: true });
}

/* Initial replacement for Server-rendered pages */
replaceTextInNode(document.body);

export {};
