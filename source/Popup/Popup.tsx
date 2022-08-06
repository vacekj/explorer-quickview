import { Box, Button, FormControl, FormHelperText, FormLabel, Select, VStack } from "@chakra-ui/react";
import * as React from "react";
import { ReactNode } from "react";
import { browser, Tabs } from "webextension-polyfill-ts";

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

const Popup: React.FC = () => {
  return (
    <VStack m={5} id="popup" minW={16}>
      <FormControl>
        <FormLabel>Chain</FormLabel>
        <Select w={"300px"}>
          <option value={"ethereum"}>Ethereum Mainnet</option>
          <option value={"polygon"}>Polygon PoS</option>
          <option value={"optimism"}>Optimism</option>
          <option value={"arbitrum"}>Arbitrum</option>
          <option value={"zksync1"}>ZKSync 1.0</option>
        </Select>
        <FormHelperText>Which chain's explorer to open addresses in</FormHelperText>
      </FormControl>
    </VStack>
  );
};

export default Popup;
