(function (blocks, editor, components, i18n, element) {
	const { __ } = i18n;
	const { createElement: el, Fragment } = element;
	const { registerBlockType } = blocks;
	const {
		BlockControls,
		AlignmentToolbar,
		InspectorControls,
		withColors,
	} = editor;
	const { PanelBody, SelectControl, Notice } = components;

	const generatedTemplate = wplp_localize_data?.all_legal_pages || [];

	registerBlockType('wplegal/wplp-legal-policies', {
		title: __('WPLP Legal Policies', 'wplegalpages'),
		description: __('Quickly insert your generated legal policy into the page using this block.', 'wplegalpages'),
		icon: '',
		category: 'common',
		keywords: ['legal', 'policy', 'wplegalpages'],
		attributes: {
			alignment: {
				type: 'string',
				default: 'left'
			},
			template: {
				type: 'string',
				default: ''
			}
		},

		edit: withColors('backgroundColor', 'textColor')(function (props) {
			const { attributes, setAttributes, className } = props;
			const { alignment, template } = attributes;

			const selectedTemplate = generatedTemplate.find(t => t.ID == template);

			return el(Fragment, {},
				el(
					BlockControls,
					{},
					el(AlignmentToolbar, {
						value: alignment,
						onChange: (newAlignment) => setAttributes({ alignment: newAlignment })
					})
				),
				el(
					InspectorControls,
					{},
					el(PanelBody, { title: __('Settings'), initialOpen: true },
						generatedTemplate.length === 0
							? el(Notice, { status: 'warning', isDismissible: false },
								el('p', {}, [
									__('No legal templates found. ', 'wplegalpages'),
									el('a', {
										href: wplp_localize_data.admin_url + 'index.php?page=wplegal-wizard#/',
										target: '_blank',
										rel: 'noopener noreferrer'
									}, __('Please create a template first', 'wplegalpages'))
								])
							)
							: el(SelectControl, {
								label: __('Select Template'),
								value: template,
								onChange: (newTemplate) => setAttributes({ template: newTemplate }),
								options: [
									{ value: '', label: 'Select Template', disabled: true },
									...generatedTemplate.map((template) => ({
										value: template.ID,
										label: template.post_title || 'Untitled Page'
									}))
								]
							})
					)
				),
				el('div', { className: className + ' has-text-align-' + alignment },
					selectedTemplate ?
						el('div', {
							className: 'legal-template-content',
							dangerouslySetInnerHTML: { __html: selectedTemplate.post_content }
						}) :
						el('p', { style: { color: '#000' } }, __('Select Template from the Settings', 'wplegalpages'))
				)
			);
		}),

		save: function (props) {
			const { alignment, template } = props.attributes;
			const selectedTemplate = generatedTemplate.find(t => t.ID == template);

			return el('div', { className: 'has-text-align-' + alignment },
				selectedTemplate &&
				el('div', {
					className: 'legal-template-content',
					dangerouslySetInnerHTML: { __html: selectedTemplate.post_content }
				})
			);
		}
	});
})(
	window.wp.blocks,
	window.wp.editor,
	window.wp.components,
	window.wp.i18n,
	window.wp.element
);
