import "emoji-log";
// @ts-ignore
import * as PouchDB from "pouchdb";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener((): void => {
  console.emoji("🦄", "extension installed");
});
