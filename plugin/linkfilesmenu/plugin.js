/*
* Link Files Menu plugin
*
* @author Robin Sallis: https://github.com/Toutouwai/CkeLinkFiles
*/

function addFilesMenu() {
	$('#link-files-menu').remove();
	var ajax_url = ProcessWire.config.urls.admin + 'login/logout/?request=CkeLinkFiles&pid=' + ProcessWire.config.CkeLinkFiles.page_id;
	var $list = $('<ul></ul>');
	$.getJSON(ajax_url).done(function(data) {
		if(data.length) {
			$.each(data, function(index, value) {
				$list.append( $('<li data-url="' + value.url + '" title="' + value.description + '">' + value.basename + '</li>') );
			});
			$list.append( $('<li class="all-files">' + config.CkeLinkFiles.all_files_text + '</li>') );
		} else {
			$list.append( $('<li class="no-files">' + config.CkeLinkFiles.no_files_text + '</li>') );
		}
	});
	$('body').append( $('<div id="link-files-menu"></div>').append($list) );
}

function hideMenu() {
	$('.cke_button__linkfilesmenu').removeClass('cke_button_on');
	$('#link-files-menu').hide();
}

CKEDITOR.plugins.add('linkfilesmenu', {
	icons: 'linkfilesmenu',
	hidpi: true,
	lang: ['en'],
	init: function(editor) {
		var $orig_element = $(editor.element.$);
		var cke_id = $orig_element.attr('id');
		editor.addCommand('showLinkFilesMenu', {
			exec: function(editor) {
				var $editor = $(editor.element.$);
				var $cke_outer = $('#cke_' + $editor.attr('id'));
				var $button = $cke_outer.find('.cke_button__linkfilesmenu').first();
				var $menu = $('#link-files-menu');
				if(!$menu.length) return;
				$menu.data('cke-id', cke_id);
				if($menu.is(":hidden")) {
					$button.addClass('cke_button_on');
					var button_offset_top = $button.offset().top;
					var button_offset_left = $button.offset().left;
					$menu.css({ top: button_offset_top + 27, left: button_offset_left });
					$menu.show();
				} else {
					$menu.hide();
					$button.removeClass('cke_button_on');
				}
			}
		});
		editor.ui.addButton('LinkFilesMenu', {
			label: editor.lang.linkfilesmenu.lfm_button_label,
			icon: 'linkfilesmenu',
			command: 'showLinkFilesMenu'
		});
		editor.on('instanceReady', function() {
			// Hide menu when clicking inside CKEditor window
			this.document.on('click', hideMenu);
		});
	}
});

$(function() {

	// Add menu on DOM ready
	addFilesMenu();

	// Add menu after ajax file upload done
	$(document).on('AjaxUploadDone', addFilesMenu);

	// Menu item clicked
	$(document).on('click', '#link-files-menu li', function(event) {
		var use_description = !!event.altKey;
		var $menu = $('#link-files-menu');
		var cke_id = $menu.data('cke-id');
		var editor = CKEDITOR.instances[cke_id];
		var html = '';

		if($(this).hasClass('no-files')) {
			// No files
			hideMenu();
			return;
		} else if($(this).hasClass('all-files')) {
			// All files
			html = '<ul>';
			$(this).siblings().each(function() {
				var text;
				if(use_description && $(this).attr('title').length) {
					text = $(this).attr('title');
				} else {
					text = $(this).text();
				}
				html += '<li><a href="' + $(this).data('url') + '">' + text + '</a></li>';
			});
			html += '</ul>';
		} else {
			// Individual file
			var text;
			var selection = editor.getSelection().getSelectedElement() || editor.getSelection().getSelectedText();
			if(selection) {
				// Something is selected in the editor
				var fragment = editor.getSelection().getRanges()[0].extractContents();
				var element = CKEDITOR.dom.element.createFromHtml('<a href="' + $(this).data('url') + '"></a>');
				fragment.appendTo(element);
				editor.insertElement(element);
				hideMenu();
				return;
			} else if(use_description && $(this).attr('title').length) {
				text = $(this).attr('title');
			} else {
				text = $(this).text();
			}
			html = '<a href="' + $(this).data('url') + '">' + text + '</a>'
		}
		editor.insertHtml(html);
		hideMenu();
	});

	// Hide menu when clicking outside of it
	$(document).on('mousedown', function(event) {
		var $target = $(event.target);
		if($target.is('.cke_button__linkfilesmenu, .cke_button__linkfilesmenu_icon') || $target.is('#link-files-menu li')) return;
		hideMenu();
	});

});
