<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.1" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:me="http://www.menota.org/ns/1.0">
    <xsl:output encoding="UTF-8" method="json" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:template match="tei:teiHeader">
        <xsl:map-entry key="'header'">
            <xsl:map>
                <xsl:apply-templates/>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:availability">
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:map-entry key="'status'" select="string(@status)"/>
                <xsl:apply-templates select="tei:licence"/>
                <xsl:map-entry key="'url'" select="string(tei:licence/@target)"/>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:teiHeader//tei:country">
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:map-entry key="'name'" select="text()"/>
                <xsl:if test="@key">
                    <xsl:map-entry key="'code'" select="string(@key)"/>                    
                </xsl:if>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:date">
        <xsl:choose>
            <xsl:when test="tei:date">
                <xsl:apply-templates/>
            </xsl:when>
            <xsl:when test="not(@when or @type)"/>
            <xsl:when test="matches(@when, '^\d{4}$')">
                <xsl:map-entry key="name()" select="concat(@when, '-01-01')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:map-entry key="name()" select="string((@when, @type)[1])"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="tei:editionStmt">
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:map-entry key="'number'" select="string(tei:edition/@n)"/>
                <xsl:apply-templates select="tei:edition/tei:date[1]"/>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:interpretation">
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:map-entry key="'lemma'" select="string(@me:lemmatized)"/>
                <xsl:map-entry key="'morph'" select="string(@me:morphAnalyzed)"/>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:normalization">
        <xsl:variable name="facs" select="contains(@me:level, 'facs')"/>
        <xsl:variable name="dipl" select="contains(@me:level, 'dipl')"/>
        <xsl:variable name="norm" select="contains(@me:level, 'norm')"/>
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:map-entry key="'facs'" select="$facs"/>
                <xsl:map-entry key="'dipl'" select="$dipl"/>
                <xsl:map-entry key="'norm'" select="$norm"/>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:teiHeader//tei:name">
        <xsl:map>
            <xsl:map-entry key="'name'" select="normalize-space(string-join(tei:persName//text(), ' '))"/>
            <xsl:if test="tei:orgName[@type='affiliation']">
                <xsl:map-entry 
                    key="'affiliations'" 
                    select="array{for $a in tei:orgName[@type='affiliation'] return $a/text()}"
                />
            </xsl:if>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:objectDesc">
        <xsl:map>
            <xsl:map-entry key="name()">
                <xsl:map>
                    <xsl:map-entry key="'form'" select="string(@form)"/>
                </xsl:map>
            </xsl:map-entry>
        </xsl:map>
        <xsl:map>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:orgName">
        <xsl:map>
            <xsl:map-entry key="'name'" select="normalize-space(text())"/>
            <xsl:if test="tei:orgName[@type='affiliation']">
                <xsl:map-entry key="'affiliations'" select="array{tei:orgName[@type='affiliation']/text()}"/>
            </xsl:if>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:repository">
        <xsl:variable name="repo">
            <xsl:choose>
                <xsl:when test="following-sibling::tei:collection">
                    <xsl:value-of select="following-sibling::tei:collection"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="."/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:map-entry key="name()" select="normalize-space($repo)"/>
    </xsl:template>
    <xsl:template match="tei:respStmt">
        <xsl:variable name="agents" as="map(*)+">
            <xsl:apply-templates select="tei:name"/>
            <xsl:apply-templates select="tei:orgName"/>
        </xsl:variable>
        <xsl:map>
            <xsl:map-entry key="'responsibilities'" select="array{
                    for $r in tei:resp return replace(normalize-space($r), ' by$', '')
                }"/>
            <xsl:map-entry key="'agents'" select="array{$agents}"/>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:titleStmt">
        <xsl:variable name="editors" as="map(*)+">
            <xsl:apply-templates select="tei:editor/tei:name"/>
            <xsl:apply-templates select="tei:editor/tei:orgName"/>
        </xsl:variable>
        <xsl:variable name="respStmt" as="map(*)+">
            <xsl:choose>
                <xsl:when test="tei:respStmt">
                    <xsl:apply-templates select="tei:respStmt"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:map/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:map-entry key="'title'" select="tei:title/text()"/>
                <xsl:map-entry key="'editors'" select="array{$editors}"/>
                <xsl:choose>
                    <xsl:when test="tei:respStmt">
                        <xsl:map-entry key="'respStmt'" select="array{$respStmt}"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:map-entry key="'respStmt'" select="array{}"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="
            tei:distributor|
            tei:idno|
            tei:licence|
            tei:msName|
            tei:settlement[ancestor::tei:teiHeader]
            ">
        <xsl:variable name="name" select="name()"/>
        <xsl:if test="not(preceding-sibling::element()[name()=$name])">
            <xsl:map-entry key="name()" select="normalize-space(text())"/>
        </xsl:if>
    </xsl:template>
    <xsl:template match="
            tei:editorialDecl|
            tei:encodingDesc|
            tei:fileDesc|
            tei:msIdentifier|
            tei:msDesc|
            tei:physDesc|
            tei:publicationStmt|
            tei:sourceDesc
        ">
        <xsl:map-entry key="name()">
            <xsl:map>
                <xsl:apply-templates/>
            </xsl:map>
        </xsl:map-entry>
    </xsl:template>
    <xsl:template match="tei:teiHeader//(
            tei:additional|
            tei:additions|
            tei:altIdentifier|
            tei:authority|
            tei:bibl|
            tei:collection|
            tei:correction|
            tei:decoDesc|
            tei:extent|
            tei:handDesc|
            tei:history|
            tei:msContents|
            tei:musicNotation|
            tei:notesStmt|
            tei:p|
            tei:profileDesc|
            tei:projectDesc|
            tei:revisionDesc|
            tei:sealDesc
        )"/>
    <xsl:template match="tei:teiHeader//*" priority="-1">
        <xsl:map-entry key="name()" select="'UNKNOWN ELEMENT'"/>
    </xsl:template>
</xsl:stylesheet>
