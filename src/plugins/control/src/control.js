import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ControlEditing from './controlediting';
import ControlUI from './controlui';

export default class Control extends Plugin {

	static get requires() {
		return [ ControlEditing, ControlUI ];
	}
}

