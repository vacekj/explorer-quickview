import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";

import Popup from "./Popup";

ReactDOM.render(
  <ChakraProvider>
    <Popup />
  </ChakraProvider>,
  document.getElementById("popup-root"),
);
