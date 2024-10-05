const defaultOptions = {
    cat: 'Layout',
}

export const genericComponents = [
    {
        name: 'Paragrafo',
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
        name: 'Div',
        cat: 'Layout',
        tag: 'div',
        inner: 'div content'
    }
];