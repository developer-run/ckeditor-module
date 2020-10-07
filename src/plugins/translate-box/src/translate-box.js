import TranslateBoxEditing from './translate-box-editing';
import TranslateBoxUI from "./translate-box-ui";
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class TranslateBox extends Plugin {
	static get requires() {
		return [ TranslateBoxEditing, TranslateBoxUI ];
	}
}
