import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { IConfig, ICommand, CommandAction } from "./app/model";

export default class ViewLoader {
  private readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  constructor(fileUri: vscode.Uri, extensionPath: string) {
    this._extensionPath = extensionPath;

    let config = this.getFileContent(fileUri);
    if (config) {
      this._panel = vscode.window.createWebviewPanel(
        "configView",
        "Config View",
        vscode.ViewColumn.One,
        {
          enableScripts: true,

          localResourceRoots: [
            vscode.Uri.file(path.join(extensionPath, "configViewer"))
          ]
        }
      );

      this._panel.webview.html = this.getWebviewContent(config);

      this._panel.webview.onDidReceiveMessage(
        (command: ICommand) => {
          switch (command.action) {
            case CommandAction.Save:
              this.saveFileContent(fileUri, command.content);
              return;
          }
        },
        undefined,
        this._disposables
      );
    }
  }

  private getWebviewContent(config: IConfig): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "configViewer", "configViewer.js")
    );
    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

    const configJson = JSON.stringify(config);

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Config View</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src https:;
                             script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = ${configJson};
        </script>
    </head>
    <body>
        <div id="root"></div>

        <script src="${reactAppUri}"></script>
    </body>
    </html>`;
  }

  private getFileContent(fileUri: vscode.Uri): IConfig | undefined {
    if (fs.existsSync(fileUri.fsPath)) {
      let content = fs.readFileSync(fileUri.fsPath, "utf8");
      let config: IConfig = JSON.parse(content);

      return config;
    }
    return undefined;
  }

  private saveFileContent(fileUri: vscode.Uri, config: IConfig) {
    if (fs.existsSync(fileUri.fsPath)) {
      let content: string = JSON.stringify(config);
      fs.writeFileSync(fileUri.fsPath, content);

      vscode.window.showInformationMessage(
        `👍 Configuration saved to ${fileUri.fsPath}`
      );
    }
  }
}
