import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { theme } from "../react/theme";
import { store } from "../redux/store";

export const customRender = (ui: ReactNode | ReactNode[]) => {
  return render(
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route element={<div>{ui}</div>} path="*" />
          </Routes>
        </HashRouter>
      </ChakraProvider>
    </Provider>
  );
};
