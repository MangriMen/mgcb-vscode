import * as vscode from "vscode";
import * as path from "path";
import * as process from "child_process";

const channel = vscode.window.createOutputChannel("MGCB Editor");

interface Command {
  command: string;
  callback: (...args: any[]) => any;
}

const commands: Command[] = [
  {
    command: "mgcb.openInMgcbEditor",
    callback: (uri: vscode.Uri) => {
      openInMgcbEditor(uri.fsPath);
    },
  },
];

function openInMgcbEditor(filePath: string) {
  let command = "dotnet";
  const tool = "mgcb-editor";
  const errorMessage = "Could not open in editor:";

  const workingDirectory = path.dirname(filePath);
  let args = [tool, filePath];

  const config = vscode.workspace.getConfiguration("mgcb");
  const executablePath = config.get<string>("executablePath");

  if (executablePath) {
    command = executablePath;
    args = [filePath];
  }

  process.execFile(
    command,
    args,
    { cwd: workingDirectory },
    (error, stdout, stderr) => {
      if (error) {
        channel.appendLine(error.message);
        vscode.window.showErrorMessage(`${errorMessage} ${error.message}`);
      }

      if (stderr) {
        channel.appendLine(stderr);
        vscode.window.showErrorMessage(`${errorMessage} ${stderr}`);
      }

      channel.appendLine(stdout);
    }
  );
}

function updateShowContextMenu() {
  const config = vscode.workspace.getConfiguration("mgcb");

  vscode.commands.executeCommand(
    "setContext",
    "mgcb.showContextMenu",
    config.get<boolean>("showContextMenu")
  );
}

function applyConfiguration(context: vscode.ExtensionContext) {
  updateShowContextMenu();
}

function setSubscriptionHandlers(context: vscode.ExtensionContext) {
  const disposable = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("mgcb.showContextMenu")) {
      updateShowContextMenu();
    }
  });

  context.subscriptions.push(disposable);
}

function registerCommands(context: vscode.ExtensionContext) {
  const disposables = commands.map((command) =>
    vscode.commands.registerCommand(command.command, command.callback)
  );

  context.subscriptions.push(...disposables);
}

export function activate(context: vscode.ExtensionContext) {
  applyConfiguration(context);
  setSubscriptionHandlers(context);
  registerCommands(context);
}

export function deactivate() {}
