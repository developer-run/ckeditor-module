import RowGridEditing from './row-grid-editing';
import RowGridUI from "./row-grid-ui";
import ColUI from "./colui";
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class RowGrid extends Plugin {
	static get requires() {
		return [ RowGridEditing, RowGridUI, ColUI ];
	}
}
