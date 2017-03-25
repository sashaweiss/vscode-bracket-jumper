# bracket-jumper
Navigate by jumping from bracket to bracket!

## Features
Travel in a text editor by jumping/selecting to the nearest enclosing right or left bracket, or the match of a currently cursor-ed bracket.

Replaces and extends functionality of VSCode's native `editor.action.jumpToBracket`.

The following commands are provided. The commands have the following (system-specific) default keybindings.
```
bracket-jumper.jumpLeft: { Mac: ctrl+left, Windows/Linux: ctrl+alt+left }
bracket-jumper.jumpRight: { Mac: ctrl+right, Windows/Linux: ctrl+alt+right }
bracket-jumper.selectLeft: { Mac: ctrl+shift+left, Windows/Linux: ctrl+alt+shift+left }
bracket-jumper.selectRight: { Mac: ctrl+shift+right, Windows/Linux: ctrl+alt+shift+right }
```

Currently recognizes the bracket characters `{, }, [, ], (, )`.

## Issues

Please let me know of any bugs or feature requests via the issues page!

## Release Notes
See the [CHANGELOG](./CHANGELOG.md)
