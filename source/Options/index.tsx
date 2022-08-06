import * as React from "react";
import ReactDOM from "react-dom";

import { ChakraProvider } from "@chakra-ui/react";
import Options from "./Options";

ReactDOM.render(
  <ChakraProvider>
    <Options />
  </ChakraProvider>,
  document.getElementById("options-root"),
);
