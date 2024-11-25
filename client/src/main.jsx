import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import tema from '../tema/tema.js'


ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={tema}>
    <App />
  </ChakraProvider>
);
