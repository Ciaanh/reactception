import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";
import { IConfig } from "./model";
import Config from "./config";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: IConfig;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
  <Config vscode={vscode} initialData={window.initialData} />,
  document.getElementById("root")
);
