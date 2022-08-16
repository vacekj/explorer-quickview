import {
  Button,
  Container,
  Heading,
  HStack,
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
// @ts-ignore
import PouchDB from "pouchdb";
import { v4 } from "uuid";
import { browser } from "webextension-polyfill-ts";

const db = new PouchDB("quickview_history");

type HistoryItem = {
  url: string;
  value: string;
  _id: string;
  /** Unix minutes timestamp */
  date: number;
  type: "tx" | "address";
};

browser.runtime.onMessage.addListener(
  async (message: HistoryItem) => {
    if (!message.url) {
      /* some native messages that we can ignore*/
      return true;
    }
    /* Store tx and URL in history */
    /* Hash the whole object to prevent duplicates */
    const date = Math.floor(Date.now() / (1000 * 60));
    const hash = await digestMessage(JSON.stringify({ ...message, date }));
    await db.put({
      _id: hash,
      _rev: "0",
      url: message.url,
      value: message.value,
      type: message.type,
      date,
    }, { force: true }).catch(e => {
      /* Thrown on duplicate */
      console.log(e);
    });
    return { success: true };
  },
);

type Doc = { id: string; doc: HistoryItem };

const Options: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    db.allDocs({ include_docs: true }).then(res => {
      setHistory(res.rows.map(d => d.doc) as unknown as HistoryItem[]);
    });
  }, [db]);

  return (
    <Container maxW={"full"} p={8}>
      <Text fontSize={"xl"} mb={3}>
        History is only stored locally.
      </Text>
      <HStack justifyContent={"space-between"}>
        <Button
          onClick={() => {
            db.allDocs({ include_docs: true, attachments: true })
              .then(async json => saveTemplateAsFile("quickview_export.json", await json));
          }}
        >
          Export as JSON
        </Button>
        <Button
          onClick={() => {
            db.destroy();
            setHistory([]);
          }}
          colorScheme={"red"}
        >
          Clear history
        </Button>
      </HStack>

      <TableContainer>
        <Table variant="striped" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Value</Th>
              <Th>URL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {history.map((item, i) => (
              <Tr>
                <Td>{(new Date(item.date * 1000 * 60)).toLocaleString()}</Td>
                <Td>{item.type}</Td>
                <Td>
                  <a href={`https://etherscan.io/${item.type}/${item.value}`}>{item.value}</a>
                </Td>
                <Td>
                  <a href={item.url}>{item.url}</a>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
  return hashHex;
}

const saveTemplateAsFile = (filename: string, dataObjToWrite: object) => {
  const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
};

export default Options;
