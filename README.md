# CKEditor Link Files

A module for ProcessWire CMS/CMF. Adds a menu to CKEditor to allow the quick insertion of links to files on the page being edited.

![link-files](https://user-images.githubusercontent.com/1538852/34805734-8142c638-f6e4-11e7-814a-3655b4e5ec76.gif)

## Features

* Hover a menu item to see the "Description" of the corresponding file (if present).
* Click a menu item to insert a link to the corresponding file at the current cursor position. The filename is used as the link text.
* If you Alt-click a menu item the file description is used as the link text (with fallback to filename if no description entered).
* If text is currently selected in the editor then the selected text is used as the link text.
* Click "* Insert links to all files *" to insert an unordered list of links to all files on the page. Also works with the Alt-click option.
* Menu is built via AJAX so newly uploaded files are included in the menu without the page needing to be saved. However, descriptions are not available for newly uploaded files until the page is saved.
* There is an option in the module config to include files from Repeater fields in the edited page. Nested Repeater fields (files inside a Repeater inside another Repeater) are not supported.

## Installation

[Install](http://modules.processwire.com/install-uninstall/) the CKEditor Link Files module.

For any CKEditor field where you want the "Insert link to file" dropdown menu to appear in the CKEditor toolbar, visit the field settings and add "LinkFilesMenu" to the "CKEditor Toolbar" settings field.
