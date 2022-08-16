import { Box, Button, FormControl, FormHelperText, FormLabel, Heading, HStack, Select, VStack } from "@chakra-ui/react";
import * as React from "react";
import { ReactNode, useState } from "react";
import browser, { Tabs } from "webextension-polyfill";
import { replaceTextInNode } from "../ContentScript";

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

const Popup: React.FC = () => {
  const [network, setNetwork] = useState(localStorage.getItem("network") ?? "mainnet");

  return (
    <VStack m={5} id="popup" minW={16}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Heading as={"h1"} fontSize={"xl"}>Explorer QuickView</Heading>

        <Button
          variant={"link"}
          onClick={() => {
            openWebPage("options.html");
          }}
        >
          History
        </Button>
      </HStack>

      <FormControl>
        <FormLabel>Chain</FormLabel>
        <Select
          value={network}
          onChange={async (e) => {
            setNetwork(e.target.value);
            localStorage.setItem("network", e.target.value);
            browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs) {
              const activeTab = tabs[0];
              browser.tabs.sendMessage(activeTab.id!, { type: "network", value: e.target.value });
            });
          }}
          w={"300px"}
        >
          <option value={"mainnet"}>Ethereum Mainnet</option>
          <option value={"polygon"}>Polygon PoS</option>
          <option value={"optimism"}>Optimism</option>
          <option value={"arbitrum"}>Arbitrum</option>
        </Select>
        <FormHelperText>Which chain's explorer to open addresses and txs in</FormHelperText>
      </FormControl>
    </VStack>
  );
};

export default Popup;
