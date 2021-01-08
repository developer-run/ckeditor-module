/**
 * @module link/utils
 */

import { upperFirst } from 'lodash-es';

const ATTRIBUTE_WHITESPACES = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g; // eslint-disable-line no-control-regex
const SAFE_URL = /^(?:(?:https?|ftps?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i;

/**
 * Returns `true` if a given view node is the col element.
 *
 * @param {module:engine/view/node~Node} node
 * @returns {Boolean}
 */
export function isColElement( node ) {
	// console.info("Node ", node.is( 'attributeElement' ), node);

	// return !!node.getCustomProperty( 'col' );
	return node.is( 'element' ) && !!node.getCustomProperty( 'column' );
}

/**
 * Creates column {@link module:engine/view/attributeelement~AttributeElement} with the provided `href` attribute.
 *
 * @param {String} href
 * @returns {module:engine/view/attributeelement~AttributeElement}
 */
export function createColElement( href, writer ) {
	// Priority 5 - https://github.com/ckeditor/ckeditor5-link/issues/121.
	const colElement = writer.createAttributeElement( 'a', { href }, { priority: 5 } );
	writer.setCustomProperty( 'col', true, colElement );

	return colElement;
}


/**
 * Returns the parent element of the given name. Returns undefined if the position or the element is not inside the desired parent.
 *
 * @param {String} parentName The name of the parent element to find.
 * @param {module:engine/model/position~Position|module:engine/model/position~Position} positionOrElement The position or
 * the parentElement to start searching.
 * @returns {module:engine/model/element~Element|module:engine/model/documentfragment~DocumentFragment}
 */
export function findAncestor( parentName, positionOrElement ) {
	let parent = positionOrElement.parent;

	while ( parent ) {
		if ( parent.name === parentName ) {
			return parent;
		}

		parent = parent.parent;
	}
}



/**
 * Returns the {@link module:link/link~LinkConfig#decorators `config.link.decorators`} configuration processed
 * to respect the locale of the editor, i.e. to display the {@link module:link/link~LinkDecoratorManualDefinition label}
 * in the correct language.
 *
 * **Note**: Only the few most commonly used labels are translated automatically. Other labels should be manually
 * translated in the {@link module:link/link~LinkConfig#decorators `config.link.decorators`} configuration.
 *
 * @param {module:utils/locale~Locale#t} t shorthand for {@link module:utils/locale~Locale#t Locale#t}
 * @param {Array.<module:link/link~LinkDecoratorDefinition>} The decorator reference
 * where the label values should be localized.
 * @returns {Array.<module:link/link~LinkDecoratorDefinition>}
 */
export function getLocalizedDecorators( t, decorators ) {
	const localizedDecoratorsLabels = {
		'Open in a new tab': t( 'Open in a new tab' ),
		'Downloadable': t( 'Downloadable' )
	};

	decorators.forEach( decorator => {
		if ( decorator.label && localizedDecoratorsLabels[ decorator.label ] ) {
			decorator.label = localizedDecoratorsLabels[ decorator.label ];
		}
		return decorator;
	} );

	return decorators;
}

/**
 * Converts an object with defined decorators to a normalized array of decorators. The `id` key is added for each decorator and
 * is used as the attribute's name in the model.
 *
 * @param {Object.<String, module:link/link~LinkDecoratorDefinition>} decorators
 * @returns {Array.<module:link/link~LinkDecoratorDefinition>}
 */
export function normalizeDecorators( decorators ) {
	const retArray = [];

	if ( decorators ) {
		for ( const [ key, value ] of Object.entries( decorators ) ) {
			const decorator = Object.assign(
				{},
				value,
				{ id: `link${ upperFirst( key ) }` }
			);
			retArray.push( decorator );
		}
	}

	return retArray;
}
