const defaultOptions = {
    cat: 'Layout',
}

export const genericComponents = [
    {
        name: 'Paragraph',
        cat: 'Text',
        tag: 'p',
        inner: 'paragrafo',
    },
    {
        name: 'Label',
        cat: 'Text',
        tag: 'label',
        inner: 'label',
        attributes: {for: 'test'}
    },
    {
        name: 'Spacer',
        cat: 'Text',
        tag: 'div',
        style: 'flex-grow: 1'
    },
    {
        name: 'Divider',
        cat: 'Text',
        tag: 'hr',
    },
];