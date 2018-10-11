const path = require("path");
const vscode = require("vscode");

function insertString(str) {
  var editor = vscode.window.activeTextEditor;
  editor.edit(edit =>
    editor.selections.forEach(selection => {
      edit.delete(selection);
      edit.insert(selection.start, str);
    })
  );
}

function getRelativePath(toPath) {
  let relativePath = "didn't work mate";
  try {
    const fromDir = path.dirname(
      vscode.window.activeTextEditor._documentData._uri.fsPath
    );
    const toDir = path.dirname(toPath);
    const basename = path.basename(toPath);
    const dir = path.relative(fromDir, toDir);

    relativePath = path.join(dir, basename);
  } catch (error) {
    vscode.window.showErrorMessage(error);
  }
  return relativePath;
}

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.importRelativePath",
    function(clickedTab) {
      if (!clickedTab || (!clickedTab && !clickedTab.fsPath)) {
        vscode.window.showErrorMessage("Try using the context menu.");
      } else {
        insertString(getRelativePath(clickedTab.fsPath));
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
