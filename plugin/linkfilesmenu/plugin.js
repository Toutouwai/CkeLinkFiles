/*
* Link Files Menu plugin
*
* @author Robin Sallis: https://github.com/Toutouwai/CkeLinkFiles
* @version 0.1.0
*/

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
	}

});

$(function() {

	// Add menu on DOM ready
	addFilesMenu(config.CkeLinkFiles.page_id);

	// Add menu after ajax file upload done
	$(document).on('AjaxUploadDone', function() {
		addFilesMenu(config.CkeLinkFiles.page_id);
	});

	// Menu item clicked
	$('body').on('click', '#link-files-menu li', function(event) {
		var use_description = !!event.altKey;
		var $menu = $('#link-files-menu');
		var cke_id = $menu.data('cke-id');
		var editor = CKEDITOR.instances[cke_id];
		var html = '';

		if($(this).hasClass('no-files')) {
			// No files
			hideMenu($menu);
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
				hideMenu($menu);
				return;
			} else if(use_description && $(this).attr('title').length) {
				text = $(this).attr('title');
			} else {
				text = $(this).text();
			}
			html = '<a href="' + $(this).data('url') + '">' + text + '</a>'
		}
		editor.insertHtml(html);
		hideMenu($menu);
	});

});

function addFilesMenu(page_id) {
	$('#link-files-menu').remove();
	var ajax_url = config.urls.admin + 'module/edit?name=CkeLinkFiles&pid=' + page_id;
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

function hideMenu($menu) {
	$('.cke_button__linkfilesmenu').removeClass('cke_button_on');
	$menu.hide();
}
