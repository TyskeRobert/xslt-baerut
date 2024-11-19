const pat = {
    cb: /^(.*?)\[cb n=(.*?)\](.*)$/,
    lb: /^(.*?)\[lb n=(.*?)\](.*)$/,
    pb: /^(.*?)\[pb n=(.*?)\](.*)$/
}

export function getPage(doc, page) {
    const pb = new RegExp(`\\[pb n=${page}\\]`);
    return doc.source.text.filter(token => 
        token.page == page || 
        token.facs?.match(pb) || 
        token.dipl?.match(pb) || 
        token.norm?.match(pb)
    );
}

export function getPageObject(textArray, page) {
    function cleanUpColumn(column) {
        if (column.lines[0].n == null) {
            column.lines.shift();
        }
    }

    const result = {
        n: page,
        columns: []
    };
    let column = {
        n: null,
        lines: []
    }
    let line = {
        n: null,
        tokens: []
    }

    for (const token of textArray) switch (token.t) {
        case "cb":
            result.columns.push(column);
            column = {
                n: token.n,
                lines: []
            };
            break;
        case "lb":
            column.lines.push(line);
            line = {
                n: token.n,
                tokens: []
            };
            break;
        case "num":
        case "pc":
        case "w":
            if (token.facs.match(pat.lb)) {
                let rest = token.facs;

                const pbMatch = rest.match(pat.pb);
                if (pbMatch) {
                    if (pbMatch[2] == page) {
                        rest = pbMatch[3];
                    } else {
                        line.tokens.push({
                            ...token,
                            facs: pbMatch[1]
                        });
                        break;
                    }
                }

                const cbMatch = rest.match(pat.cb);
                if (cbMatch) {
                    if (cbMatch[1]) {
                        line.tokens.push({
                            ...token, 
                            facs: cbMatch[1]
                        });
                    }
                    column.lines.push(line);
                    cleanUpColumn(column);
                    result.columns.push(column);
                    column = {
                        n: cbMatch[2],
                        lines: []
                    };
                    line = {
                        n: null,
                        tokens: []
                    };
                    rest = cbMatch[3];
                }

                let lbMatch = rest.match(pat.lb);
                while (lbMatch) {
                    if (lbMatch[1]) {
                        line.tokens.push({
                            ...token,
                            facs: lbMatch[1]
                        });
                    }
                    column.lines.push(line);
                    line = {
                        n: lbMatch[2],
                        tokens: []
                    }
                    rest = lbMatch[3];
                    lbMatch = rest.match(pat.lb);
                }

                line.tokens.push({
                    ...token, 
                    facs: rest
                });
            } 
            else line.tokens.push(token);
            break;
    }

    column.lines.push(line);
    cleanUpColumn(column);
    
    result.columns.push(column);
    if (result.columns.length > 1) {
        result.columns.shift();
    }

    return result;
}