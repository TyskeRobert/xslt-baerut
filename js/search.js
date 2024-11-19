export function getPage(doc, page) {
    const pb = new RegExp(`\\[pb n=${page}\\]`);
    console.log(pb);
    return doc.source.text.filter(token => {
        return token.page == page || 
            token.facs?.match(pb) || 
            token.dipl?.match(pb) || 
            token.norm?.match(pb);
    });
}