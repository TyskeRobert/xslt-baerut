<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0">
    <xsl:output encoding="UTF-8" method="json" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:include href="header.xsl"/>
    <xsl:include href="text.xsl"/>
    <xsl:template match="corpus">
        <xsl:map>
            <xsl:map-entry key="'date'" select="current-dateTime()"/>
            <xsl:map-entry key="'sources'" select="array{for $s in source return string($s/@id)}"/>
        </xsl:map>
        <xsl:apply-templates/>
    </xsl:template>
    <xsl:template match="source">
        <xsl:result-document href="../../json/data/corpus/{@id}.json" method="json">
            <xsl:variable name="source" select="doc(concat('../tei/', @id, '.xml'))"/>
            <xsl:map>
                <xsl:map-entry key="'date'" select="current-dateTime()"/>
                <xsl:map-entry key="'id'" select="string(@id)"/>
                <xsl:map-entry key="'source'">
                    <xsl:map>
                        <xsl:apply-templates select="$source/tei:TEI"/>
                    </xsl:map>
                </xsl:map-entry>
            </xsl:map>
        </xsl:result-document>
    </xsl:template>
</xsl:stylesheet>